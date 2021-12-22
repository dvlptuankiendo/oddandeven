import mongoose from "mongoose";
import {
  WITHDRAW_REQUEST_STATUS,
  TRANSACTION_PROVIDERS,
} from "../utils/constants.js";

const { IS_PROCESSING, APPROVED, CANCELLED } = WITHDRAW_REQUEST_STATUS;
const { MOMO, THESIEURE } = TRANSACTION_PROVIDERS;

const Schema = mongoose.Schema;

const schema = new Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: [IS_PROCESSING, APPROVED, CANCELLED],
    default: IS_PROCESSING,
  },
  provider: {
    type: String,
    enum: [MOMO, THESIEURE],
  },
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

const WithDraw = mongoose.model("WithDraw", schema);

export default WithDraw;
