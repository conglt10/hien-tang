'use strict';
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const Giver = require('../models/Giver');
const Receiver = require('../models/Receiver');
const { FileSystemWallet, Gateway, X509WalletMixin, Wallets } = require('fabric-network');
const path = require('path');
const mongoose = require('mongoose');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');

require('dotenv').config();

// Connect database
mongoose.connect(
  process.env.MONGODB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (error) => {
    if (error) console.log(error);
  }
);

mongoose.set('useCreateIndex', true);

exports.connectToNetwork = async function(user, cli = false) {
  try {
    let orgMSP = 'bachmai';

    if (user.role === USER_ROLES.ADMIN_CHORAY || user.role === USER_ROLES.DOCTOR_CHORAY) {
      orgMSP = 'choray';
    } else {
      let response = {};
      response.error =
        'An identity for the user ' +
        identity +
        ' does not exist in the wallet. Register ' +
        identity +
        ' first';
      return response;
    }

    let identity = user.username;

    const ccpPath = path.resolve(__dirname, '../..', 'network', `connection-${orgMSP}.json`);
    let walletPath = path.join(process.cwd(), `cli/wallet-${orgMSP}`);

    if (cli) {
      walletPath = path.join(process.cwd(), `/wallet-${orgMSP}`);
    }

    const wallet = new FileSystemWallet(walletPath);
    const userExists = await wallet.exists(identity);

    let networkObj;

    if (!userExists) {
      let response = {};
      response.error =
        'An identity for the user ' +
        identity +
        ' does not exist in the wallet. Register ' +
        identity +
        ' first';
      return response;
    } else {
      const gateway = new Gateway();

      await gateway.connect(ccpPath, {
        wallet: wallet,
        identity: identity,
        discovery: { enabled: true, asLocalhost: true }
      });

      const network = await gateway.getNetwork('hientangchannel');
      const contract = await network.getContract('hientang');

      networkObj = {
        contract: contract,
        network: network,
        gateway: gateway,
        user: user
      };
    }

    return networkObj;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
};

exports.query = async function(networkObj, func, args) {
  let response = {
    success: false,
    msg: ''
  };
  try {
    if (Array.isArray(args)) {
      response.msg = await networkObj.contract.evaluateTransaction(func, ...args);

      await networkObj.gateway.disconnect();
      response.success = true;
      return response;
    } else if (args) {
      response.msg = await networkObj.contract.evaluateTransaction(func, args);

      await networkObj.gateway.disconnect();
      response.success = true;
      return response;
    } else {
      response.msg = await networkObj.contract.evaluateTransaction(func);

      await networkObj.gateway.disconnect();
      response.success = true;
      return response;
    }
  } catch (error) {
    response.success = false;
    response.msg = error;
    return response;
  }
};

exports.registerDoctorOnBlockchain = async function(doctor, orgMSP) {
  try {
    let username = doctor.username;
    let password = doctor.password;
    let fullname = doctor.fullname;
    let admin;

    if (orgMSP === 'bachmai') {
      admin = process.env.ADMIN_BACHMAI_USERNAME;
    } else if (orgMSP === 'choray') {
      admin = process.env.ADMIN_CHORAY_USERNAME;
    }

    let nameMSP = await changeCaseFirstLetter(orgMSP);

    const ccpPath = path.resolve(__dirname, '../..', 'network', `connection-${orgMSP}.json`);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), `wallet-${orgMSP}`);
    const wallet = new FileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(username);
    if (userExists) {
      console.log(`An identity for the user ${username} already exists in the wallet-${orgMSP}`);
      return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(admin);
    if (!adminExists) {
      console.log(`Admin user ${admin} does not exist in the wallet`);
      console.log('Run the enrollAdmin.js application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: admin,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();
    const network = await gateway.getNetwork('hientangchannel');

    let user;

    if (orgMSP === 'bachmai') {
      user = new User({
        username,
        password,
        fullname,
        role: USER_ROLES.DOCTOR_BACHMAI
      });
    } else if (orgMSP === 'choray') {
      user = new User({
        username,
        password,
        fullname,
        role: USER_ROLES.DOCTOR_CHORAY
      });
    }

    let userSaved = await user.save();

    if (userSaved) {
      //Register the user, enroll the user, and import the new identity into the wallet.
      const secret = await ca.register(
        {
          affiliation: '',
          enrollmentID: user.username,
          role: 'client',
          attrs: [{ name: 'username', value: user.username, ecert: true }]
        },
        adminIdentity
      );

      const enrollment = await ca.enroll({
        enrollmentID: user.username,
        enrollmentSecret: secret
      });

      const userIdentity = X509WalletMixin.createIdentity(
        `${nameMSP}MSP`,
        enrollment.certificate,
        enrollment.key.toBytes()
      );

      await wallet.import(user.username, userIdentity);

      console.log(
        `Successfully registered and enrolled user ${user.username} and imported it into the wallet`
      );
    }

    await gateway.disconnect();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

exports.verifyGiver = async function(networkObj, giver) {
  if (!giver.passportID || !giver.fullname || !giver.blood || !giver.organ || !giver.status) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can verrify!';
    return response;
  }

  try {
    await networkObj.contract.submitTransaction(
      'CreateGiver',
      giver.passportID,
      giver.fullname,
      giver.blood,
      giver.organ,
      giver.status
    );

    const filter = { passportID: giver.passportID };
    const update = { verified: true };
    await Giver.findOneAndUpdate(filter, update);

    let response = {
      success: true,
      msg: 'Verify success!'
    };

    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    let response = {
      success: false,
      msg: error
    };
    return response;
  }
};

exports.verifyReceiver = async function(networkObj, receiver) {
  if (
    !receiver.passportID ||
    !receiver.fullname ||
    !receiver.blood ||
    !receiver.organ ||
    !receiver.hospital ||
    !receiver.status
  ) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can verrify!';
    return response;
  }

  try {
    await networkObj.contract.submitTransaction(
      'CreateReceiver',
      receiver.passportID,
      receiver.fullname,
      receiver.blood,
      receiver.organ,
      receiver.hospital,
      receiver.status
    );

    const filter = { passportID: receiver.passportID };
    const update = { verified: true };
    await Receiver.findOneAndUpdate(filter, update);

    let response = {
      success: true,
      msg: 'Verify success!'
    };

    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    let response = {
      success: false,
      msg: error
    };
    return response;
  }
};

function changeCaseFirstLetter(params) {
  if (typeof params === 'string') {
    return params.charAt(0).toUpperCase() + params.slice(1);
  }
  return null;
}
