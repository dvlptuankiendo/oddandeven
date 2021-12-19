import mongoose from "mongoose";
import { TRANSACTION_OPTIONS, TRANSACTION_PROVIDERS } from "../utils/constants.js";

const { DEPOSIT, WITHDRAW } = TRANSACTION_OPTIONS
const { MOMO, THESIEURE } = TRANSACTION_PROVIDERS

const Schema = mongoose.Schema;

const schema = new Schema({
  username: {
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

export default User;
