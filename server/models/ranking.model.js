import mongoose from "mongoose"

const Schema = mongoose.Schema;

const schema = new Schema({
  users: [
    {
      userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      amount: { type: Number, required: true },
    },
  ],
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

const Ranking = mongoose.model("Ranking", schema);

export default Ranking;
