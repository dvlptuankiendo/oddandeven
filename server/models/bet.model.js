import mongoose from "mongoose"
import { EVENODDHIGHLOW_OPTIONS, XIEN_OPTIONS, BET_STATUS, BET_TYPES } from "../utils/constants.js"

const Schema = mongoose.Schema;

const { EVENODDHIGHLOW, XIEN, LO } = BET_TYPES
const { ODDHIGH, ODDLOW, EVENHIGH, EVENLOW } = XIEN_OPTIONS
const { LOW, HIGH, EVEN, ODD } = EVENODDHIGHLOW_OPTIONS
const { WIN, LOSE } = BET_STATUS

const schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  type: { type: String, enum: [EVENODDHIGHLOW, XIEN, LO] },
  chosenTextOption: { type: String, enum: [LOW, HIGH, EVEN, ODD, ODDHIGH, ODDLOW, EVENHIGH, EVENLOW] },
  chosenNumberOption: { type: Number },
  amount: { type: Number, required: true },
  status: { type: String, enum: [WIN, LOSE] },
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

const Bet = mongoose.model("Bet", schema);

export default Bet;
