const router = require('express').Router();
const Giver = require('../models/Giver');
const Receiver = require('../models/Receiver');

router.get('/allGiver', async (req, res) => {
  let allGiver = await Giver.find({});

  return res.json(allGiver);
});

router.get('/allReceiver', async (req, res) => {
  let allReceiver = await Receiver.find({});

  return res.json(allReceiver);
});

module.exports = router;
