const mongoose = require("mongoose");
const { LOWHIGH, EVENODD, WIN, LOSE } = require("../utils/constants");

const Schema = mongoose.Schema;

const schema = new Schema({
  userId: { type: String, required: true, trim: true },
  type: { type: String, enum: [LOWHIGH, EVENODD] },
  amount: { type: Number, required: true },
  status: { type: String, enum: [WIN, LOSE] },
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

const Bet = mongoose.model("Bet", schema);

module.exports = Bet;
