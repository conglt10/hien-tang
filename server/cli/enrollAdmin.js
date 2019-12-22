'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
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
    let orgMSP = 'bachmai';

    if (argv.orgMSP) {
      orgMSP = argv.orgMSP.toString();
    }

    let nameMSP = await changeCaseFirstLetter(orgMSP);

    const ccpPath = path.resolve(__dirname, '../..', 'network', `connection-${orgMSP}.json`);

    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities[`ca.${orgMSP}.hientang.com`];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), `wallet-${orgMSP}`);
    const wallet = new FileSystemWallet(walletPath);

    let usernameAdmin = `ADMIN_${orgMSP.toUpperCase()}_USERNAME`;
    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(process.env.usernameAdmin);
    if (adminExists) {
      console.log(
        `An identity for the admin user ${process.env.usernameAdmin} already exists in the wallet`
      );
      return;
    }

    let user;

    if (orgMSP === 'bachmai') {
      user = new User({
        username: process.env.ADMIN_BACHMAI_USERNAME,
        password: process.env.ADMIN_BACHMAI_PASSWORD,
        role: USER_ROLES.ADMIN_BACHMAI
      });
    }
    if (orgMSP === 'choray') {
      user = new User({
        username: process.env.ADMIN_CHORAY_USERNAME,
        password: process.env.ADMIN_CHORAY_PASSWORD,
        role: USER_ROLES.ADMIN_CHORAY
      });
    }

    let userSaved = await user.save();

    if (userSaved) {
      // Enroll the admin user, and import the new identity into the wallet.
      const enrollment = await ca.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: 'adminpw'
      });
      const identity = await X509WalletMixin.createIdentity(
        `${nameMSP}MSP`,
        enrollment.certificate,
        enrollment.key.toBytes()
      );
      await wallet.import(user.username, identity);
      console.log(
        `Successfully enrolled admin user ${user.username} and imported it into the wallet-${orgMSP}`
      );
      process.exit(0);
    }
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
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
