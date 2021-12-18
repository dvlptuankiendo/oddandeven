import passwordHash from "password-hash";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const logIn = async (username, password) => {
  const user = await User.findOne({ username }).lean();
  if (!user) throw new Error("Bad credential");

  const passed = passwordHash.verify(password, user.password);
  if (!passed) throw new Error("Bad credential");

  const data = {
    userId: user._id,
    username: user.username,
    amount: user.amount,
  };

  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE,
  });

  return { data, accessToken };
};

const register = async (username, password) => {
  const isLostInfo =
    !username || !username.trim() || !password || !password.trim();

  if (!!isLostInfo) throw new Error("Please provide your information");

  const existedUser = await User.findOne({ username }).lean();
  if (!!existedUser) throw new Error("Username was taken");

  const newUser = new User({
    username,
    password: passwordHash.generate(password),
  });

  await newUser.save();
  return { id: newUser._id };
};

export default {
  logIn,
  register,
};
