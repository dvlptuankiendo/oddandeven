import passwordHash from 'password-hash';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

const logIn = async (account, password) => {
  const user = await User.findOne({ account }).lean();
  if (!user) throw new Error('Bad credential');

  const passed = passwordHash.verify(password, user.password);
  if (!passed) throw new Error('Bad credential');

  const data = {
    _id: user._id,
    account: user.account,
    displayName: user.displayName,
    amount: user.amount
  };

  const accessToken = jwt.sign(
    data,
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE,
    },
  );

  return { data, accessToken };
};

const register = async (account, displayName, password) => {
  console.log({ account, displayName, password })
  const isLostInfo = !account || !account.trim()
    || !displayName || !displayName.trim()
    || !password || !password.trim();

  if (!!isLostInfo) throw new Error('Please provide your information');

  const userWithAccount = await User.findOne({ account }).lean();
  if (!!userWithAccount) throw new Error('Account was taken');

  const userWithDisplayName = await User.findOne({ displayName }).lean();
  if (!!userWithDisplayName) throw new Error('Display name was taken');

  const newUser = new User({
    account,
    password: passwordHash.generate(password),
    displayName,
  });
  await newUser.save();
  return { id: newUser._id };
};

export default {
  logIn,
  register
};