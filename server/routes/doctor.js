const router = require('express').Router();
const USER = require('../models/User');
const ROLE = require('../configs/constant').USER_ROLES;
const { body, validationResult } = require('express-validator');
const network = require('../fabric/network');
require('dotenv').config();

router.get('/all', async (req, res) => {
  try {
    const user = req.decoded.user;
    let doctors;

    if (user.role === ROLE.ADMIN_BACHMAI) {
      doctors = await USER.find({ role: ROLE.DOCTOR_BACHMAI });
    } else if (user.role === ROLE.ADMIN_CHORAY) {
      doctors = await USER.find({ role: ROLE.DOCTOR_CHORAY });
    } else {
      return res.status(403).json({
        msg: 'Permission Denied'
      });
    }

    return res.json({
      doctors: doctors
    });
  } catch (error) {
    return res.status(500).json({
      msg: 'Query All Doctor Failed'
    });
  }
});

router.post(
  '/add',
  [
    body('fullname')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body('username')
      .not()
      .isEmpty()
      .trim()
      .escape()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const user = req.decoded.user;
      const { username, fullname } = req.body;

      if (user.role === ROLE.ADMIN_BACHMAI) {
        const isExist = await USER.findOne({ username: username, role: ROLE.DOCTOR_BACHMAI });

        if (isExist) {
          return res.status(409).json({
            msg: 'Username already exists'
          });
        }

        const newDoctor = { username, fullname, password: process.env.DOCTOR_DEFAULT_PASSWORD };
        const response = await network.registerDoctorOnBlockchain(newDoctor, 'bachmai');

        if (!response.success) {
          return res.json({
            msg: 'Create doctor successfully'
          });
        }
      } else if (user.role === ROLE.ADMIN_CHORAY) {
        const isExist = await USER.findOne({ username: username, role: ROLE.DOCTOR_CHORAY });

        if (isExist) {
          return res.status(409).json({
            msg: 'Username already exists'
          });
        }

        const newDoctor = { username, fullname, password: process.env.DOCTOR_DEFAULT_PASSWORD };
        const response = await network.registerDoctorOnBlockchain(newDoctor, 'choray');

        if (!response.success) {
          return res.json({
            msg: 'Create doctor successfully'
          });
        }
      } else {
        return res.status(403).json({
          msg: 'Permission Denied'
        });
      }

      return res.json({
        doctors: doctors
      });
    } catch (error) {
      return res.status(500).json({
        msg: 'Query All Doctor Failed'
      });
    }
  }
);

module.exports = router;
