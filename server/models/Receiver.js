const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReceiverSchema = new Schema({
  passportID: {
    type: String,
    unique: true,
    required: [true, "can't be blank"]
  },
  fullname: {
    type: String,
    required: [true, "can't be blank"]
  },
  birthday: {
    type: Date,
    required: [true, "can't be blank"]
  },
  gender: {
    type: String,
    required: [true, "can't be blank"]
  },
  address: {
    type: String,
    required: [true, "can't be blank"]
  },
  major: String,
  company: String,
  phone: String,
  height: {
    type: Number,
    required: [true, "can't be blank"]
  },
  weight: {
    type: Number,
    required: [true, "can't be blank"]
  },
  blood: {
    type: String,
    required: [true, "can't be blank"]
  },
  secret: {
    type: Boolean,
    required: [true, "can't be blank"]
  },
  verified: {
    type: Boolean,
    default: false
  },
  timeRegister: {
    type: Date,
    default: Date.now
  },
  organ: {
    type: String,
    required: [true, "can't be blank"]
  },
  hospital: {
    type: String,
    required: [true, "can't be blank"]
  },
  status: {
    type: String,
    required: [true, "can't be blank"]
  }
});

const Receiver = mongoose.model('Receiver', ReceiverSchema);

module.exports = Receiver;
