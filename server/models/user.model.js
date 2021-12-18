import mongoose from "mongoose";
import { DEPOSIT, WITHDRAW, MOMO, THESIEURE } from "../utils/constants.js";

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
