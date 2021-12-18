import dotenv from "dotenv";
import passwordHash from "password-hash";
import mongoose from "mongoose";

import User from "./models/user.model.js";
import Result from "./models/result.model.js";

dotenv.config();

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { autoIndex: true, autoCreate: true });

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB database connected successfully!")
  seedData();
);

const seedUser = async () => {
  console.log("init users...");
  const initialized = await User.find();
  if (!initialized) {
    const newUser = new User({
      username: "admintest",
      password: passwordHash.generate("Asdfgh1@3"),
    });

    await newUser.save();
  }
  console.log("init users done");
};

const seedResult = async () => {
  console.log("init results...");
  const initialized = await Result.countDocuments();
  if (!initialized) {
    const now = Date.now();
    for (let i = 0; i < 10; i++) {
      const newResult = new Result({
        createdAt: now - 2 * 60 * 1000 * i,
        value: Math.round(Math.random() * 100),
      });

      await newResult.save();
    }
  }

  console.log("init results done");
};

const seedData = async () => {
  await seedUser();
  await seedResult();
  console.log("Seed data done");
};
