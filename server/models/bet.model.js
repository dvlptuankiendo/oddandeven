import mongoose from "mongoose"
import { LOWHIGH, EVENODD, LOW, HIGH, EVEN, ODD, WIN, LOSE } from "../utils/constants.js"

const Schema = mongoose.Schema;

const schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  type: { type: String, enum: [LOWHIGH, EVENODD] },
  chosenOption: { type: String, enum: [LOW, HIGH, EVEN, ODD] },
  amount: { type: Number, required: true },
  status: { type: String, enum: [WIN, LOSE] },
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

const Bet = mongoose.model("Bet", schema);

export default Bet;
