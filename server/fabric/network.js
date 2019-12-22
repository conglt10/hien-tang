'use strict';
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const Giver = require('../models/Giver');
const Receiver = require('../models/Receiver');
const User = require('../models/User');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const mongoose = require('mongoose');

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

    if (user.role == USER_ROLES.ADMIN_CHORAY || user.role == USER_ROLES.DOCTOR_CHORAY) {
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

exports.registerDoctorOnBlockchain = async function(networkObj, createdUser, orgMSP) {
  if (!createdUser.username) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  let nameMSP = changeCaseFirstLetter(orgMSP);
  let roleUser = `DOCTOR_${orgMSP.toUpperCase()}`;

  try {
    const ccpPath = path.resolve(__dirname, '../..', 'network', `connection-${orgMSP}.json`);
    const walletPath = path.join(process.cwd(), `/cli/wallet-${orgMSP}`);
    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists(createdUser.username);
    if (userExists) {
      console.log(`An identity for the user ${createdUser.username} already exists in the wallet`);
      return;
    }

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = await networkObj.gateway.getClient().getCertificateAuthority();
    const adminIdentity = await networkObj.gateway.getCurrentIdentity();

    let doctor = new User({
      username: createdUser.username,
      password: process.env.DOCTOR_DEFAULT_PASSWORD,
      fullname: createdUser.fullname,
      role: USER_ROLES.roleUser
    });

    let user = await doctor.save();

    if (user) {
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
    }

    let response = {
      success: true,
      msg: 'Register success!'
    };

    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    console.error(`Failed to register!`);
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
