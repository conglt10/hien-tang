'use strict';

const argv = require('yargs').argv;
const path = require('path');
const conn = require('../fabric/network');
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const Giver = require('../models/Giver');
const Receiver = require('../models/Receiver');

async function main() {
  try {
    if (!argv.func || !argv.admin) {
      console.log(`Parameter func or userid cannot undefined`);
      return;
    }

    let functionName = argv.func.toString();
    let username = argv.username.toString();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}

main();
