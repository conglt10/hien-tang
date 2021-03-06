'use strict';

const argv = require('yargs').argv;
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;

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

async function main() {
  try {
    let username;
    let password = '123123';
    let fullname;
    let orgMSP = 'bachmai';
    let admin;

    if (argv.password) {
      password = argv.password.toString();
    }

    if (!argv.username || !argv.fullname) {
      console.log(`username or fullname undefined`);
      return;
    } else {
      username = argv.username.toString();
      fullname = argv.fullname.toString();
    }

    if (argv.orgMSP) {
      orgMSP = argv.orgMSP.toString();
    }

    if (orgMSP === 'bachmai') {
      admin = process.env.ADMIN_BACHMAI_USERNAME;
    }
    if (orgMSP === 'choray') {
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
}

function changeCaseFirstLetter(params) {
  if (typeof params === 'string') {
    return params.charAt(0).toUpperCase() + params.slice(1);
  }
  return null;
}

main();
