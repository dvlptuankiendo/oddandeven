import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
  value: { type: Number, required: true },
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

const Result = mongoose.model("Result", schema);

export default Result;
