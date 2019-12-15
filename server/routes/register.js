const router = require('express').Router();
const Giver = require('../models/Giver');
const Receiver = require('../models/Receiver');
const { check, validationResult } = require('express-validator');

router.post('/giver', async (req, res) => {
  const {
    passportid,
    fullname,
    birthday,
    gender,
    address,
    major,
    company,
    phone,
    height,
    weight,
    blood,
    secret,
    organ
  } = req.body;

  try {
    let giverIsExist = await Giver.findOne({ passportID: passportid });

    if (giverIsExist) {
      return res.status(409).json({
        success: false,
        msg: 'Account already exist'
      });
    }

    let newGiver = new Giver({
      passportid,
      fullname,
      birthday,
      gender,
      address,
      major,
      company,
      phone,
      height,
      weight,
      blood,
      secret,
      organ
    });

    await newGiver.save();
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Internal Server Error'
    });
  }
});

router.post('/receiver', async (req, res) => {
  const {
    passportid,
    fullname,
    birthday,
    gender,
    address,
    major,
    company,
    phone,
    height,
    weight,
    blood,
    secret,
    organ,
    hospital
  } = req.body;

  try {
    let giverIsExist = await Giver.findOne({ passportID: passportid });

    if (giverIsExist) {
      return res.status(409).json({
        success: false,
        msg: 'Account already exist'
      });
    }

    let newReceiver = new Receiver({
      passportid,
      fullname,
      birthday,
      gender,
      address,
      major,
      company,
      phone,
      height,
      weight,
      blood,
      secret,
      organ,
      hospital
    });

    await newReceiver.save();
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Internal Server Error'
    });
  }
});

module.exports = register;
