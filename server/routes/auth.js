const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
let secretJWT = require('../configs/secret').secret;

// Login
router.post(
  '/login',
  [
    check('username')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('password').isLength({ min: 6 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res.status(404).json({
          success: false,
          msg: 'Account is not exist'
        });
      }

      let validPassword = await bcrypt.compare(req.body.password, user.password);

      if (!validPassword) {
        return res.status(403).json({
          success: false,
          msg: 'Username or Password incorrect'
        });
      }

      let token = jwt.sign(
        {
          user: user
        },
        secretJWT
      );

      return res.json({
        success: true,
        fullname: user.fullname,
        msg: 'Login success',
        token: token,
        role: user.role
      });
    } catch (error) {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: 'Internal Server Error'
        });
      }
    }
  }
);

module.exports = router;
