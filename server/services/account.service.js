import passwordHash from "password-hash";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const logIn = async (username, password) => {
  const user = await User.findOne({ username }).lean();
  if (!user) throw new Error("Thông tin không hợp lệ");

  const passed = passwordHash.verify(password, user.password);
  if (!passed) throw new Error("Thông tin không hợp lệ");

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

  if (!!isLostInfo)
    throw new Error("Vui lòng cung cấp đủ tên đăng nhập và mật khẩu");

  const existedUser = await User.findOne({ username }).lean();
  if (!!existedUser) throw new Error("Tên đăng nhập đã được sử dụng");

  const newUser = new User({
    username,
    password: passwordHash.generate(password),
  });

  await newUser.save();
  return { id: newUser._id };
};

const getInfo = async (token) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
  const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY);

  const user = await User.findOne({ _id: userInfo.userId }).lean();
  if (!user) throw new Error("Người dùng không tồn tại");

  return {
    userId: user._id,
    username: user.username,
    amount: user.amount,
  };
};

const getHistory = async (userId) => {
  const user = await User.findOne({ _id: userId }).lean();
  if (user) return user.history || [];

  return [];
};

export default {
  logIn,
  register,
  getInfo,
  getHistory,
};
