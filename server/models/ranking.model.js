const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema({
  users: [
    {
      userId: { type: String, required: true, trim: true },
      amount: { type: Number, required: true },
    },
  ],
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

const Ranking = mongoose.model("Ranking", schema);

module.exports = Ranking;
