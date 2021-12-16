const mongoose = require("mongoose");
const { DEPOSIT, WITHDRAW, MOMO, THESIEURE } = require("../utils/constants");

const Schema = mongoose.Schema;

const schema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  history: [
    {
      type: { type: String, enum: [DEPOSIT, WITHDRAW] },
      provider: { type: String, enum: [MOMO, THESIEURE] },
      amount: { type: Number },
      metaData: { type: String },
      createdAt: { type: Number, required: true, default: () => Date.now() },
    },
  ],
  createdAt: {
    type: Number,
    required: true,
    default: () => Date.now(),
  },
});

const User = mongoose.model("User", schema);

module.exports = User;
