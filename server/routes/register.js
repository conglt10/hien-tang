const router = require('express').Router();
const Giver = require('../models/Giver');
const Receiver = require('../models/Receiver');
const { body, validationResult } = require('express-validator');

router.post('/giver', async (req, res) => {
  const {
    passportID,
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
  } = req.body.data;

  try {
    let giverIsExist = await Giver.findOne({ passportID: passportID });

    if (giverIsExist) {
      return res.status(409).json({
        success: false,
        msg: 'Account already exist'
      });
    }

    let newGiver = new Giver({
      passportID,
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

    return res.status(200).json({
      success: true,
      msg: 'Register success'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Internal Server Error'
    });
  }
});

router.post('/receiver', async (req, res) => {
  const {
    passportID,
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
  } = req.body.data;

  try {
    let giverIsExist = await Giver.findOne({ passportID: passportID });

    if (giverIsExist) {
      return res.status(409).json({
        success: false,
        msg: 'Account already exist'
      });
    }

    let newReceiver = new Receiver({
      passportID,
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

module.exports = router;
