import {
  MIN_BET_AMOUNT,
  EVENODDHIGHLOW_OPTIONS,
  BET_STATUS,
  BET_TYPES,
  XIEN_OPTIONS,
} from "../utils/constants.js";
import User from "../models/user.model.js";
import Bet from "../models/bet.model.js";
import Result from "../models/result.model.js";

const { EVENODDHIGHLOW, XIEN, LO } = BET_TYPES;
const { ODDHIGH, ODDLOW, EVENHIGH, EVENLOW } = XIEN_OPTIONS;
const { LOW, HIGH, EVEN, ODD } = EVENODDHIGHLOW_OPTIONS;
const { WIN, LOSE } = BET_STATUS;

const createABet = async (
  userId,
  type,
  chosenTextOption,
  chosenNumberOption,
  amount
) => {
  const existedBetting = await Bet.findOne({
    userId,
    status: { $nin: [WIN, LOSE] },
  }).lean();
  if (existedBetting) throw new Error("Bạn đã đặt cược");

  const existUser = await User.findOne({ _id: userId }).lean();
  if (!existUser) throw new Error("Người dùng không tồn tại");

  if (![EVENODDHIGHLOW, XIEN, LO].includes(type))
    throw new Error("Vui lòng chọn trò chơi");

  const invalidEvenOddHighLow =
    type === EVENODDHIGHLOW &&
    ![LOW, HIGH, EVEN, ODD].includes(chosenTextOption);
  const invalidXien =
    type === XIEN &&
    ![ODDHIGH, ODDLOW, EVENHIGH, EVENLOW].includes(chosenTextOption);
  const invalidLo = false;
  if (type === LO) {
    try {
      const number = parseInt(chosenNumberOption);
      if (Number.isNaN(number) || number > 99 || number < 0) invalidLo = true;
    } catch (error) {
      throw new Error("Lựa chọn không hợp lệ");
    }
  }
  if (invalidEvenOddHighLow || invalidXien || invalidLo)
    throw new Error("Lựa chọn không hợp lệ");

  if (!amount || amount < MIN_BET_AMOUNT)
    throw new Error(`Số tiền đặt cược tối thiểu là ${MIN_BET_AMOUNT}$`);

  if (existUser.amount < amount)
    throw new Error(`Số dư tài khoản hiện tại không đủ, vui lòng nạp thêm`);

  //logic prevent creating a bet at last 15 seconds or when calculating result ???

  const mostRecentUndoneResult = await Result.findOne({ value: -1 }).lean()
  if (!mostRecentUndoneResult) throw new Error("Đặt cược thất bại");

  await User.findByIdAndUpdate(existUser._id, {
    amount: existUser.amount - amount,
    amountPlayedToday: existUser.amountPlayedToday + amount
  });

  const newBet = new Bet({
    userId,
    type,
    amount,
  });

  if ([EVENODDHIGHLOW, XIEN].includes(type))
    newBet.chosenTextOption = chosenTextOption;
  if (type === LO) newBet.chosenNumberOption = chosenNumberOption;

  newBet.resultId = mostRecentUndoneResult._id;

  await newBet.save();
  return { id: newBet._id };
};

const cancelABet = async (userId, betId) => {
  const existPendingBet = await Bet.findOne({
    _id: betId,
    userId,
    status: { $nin: [WIN, LOSE] },
  }).lean();
  if (!existPendingBet) throw new Error("Lệnh cược không tồn tại ");

  const existUser = await User.findOne({ _id: userId }).lean();
  if (!existUser) throw new Error("Người dùng không tồn tại");

  const { amount } = existPendingBet;

  await Bet.findByIdAndDelete(betId);

  await User.findByIdAndUpdate(existUser._id, {
    amount: existUser.amount + amount,
  });

  return { id: existPendingBet._id };
};

const getActiveBet = async (userId) => {
  const existedBetting = await Bet.findOne({
    userId,
    status: { $nin: [WIN, LOSE] },
  }).lean();

  return existedBetting;
};

const getRecentBets = async (userId, isOnlyFromUser = false, count = 10) => {
  const query = isOnlyFromUser ? { userId } : {}
  const recentBetting = await Bet
    .find(query)
    .sort({ createdAt: -1 })
    .limit(count)
    .populate('userId')
    .populate('resultId')

  const data = recentBetting.map(b => formatRecentBet(b))

  return data
}

const formatRecentBet = (bet) => {
  if (!bet) return
  const { userId, amount, type, chosenTextOption, chosenNumberOption, status, resultId, createdAt } = bet
  const username = userId?.username
  const result = resultId?.value

  let betType = null
  let chosenOption = null
  let receivedAmount = null

  if (type === EVENODDHIGHLOW) {
    if (chosenTextOption === EVEN || chosenTextOption === ODD) {
      betType = "Chẵn lẻ"
      if (chosenTextOption === EVEN) chosenOption = "Chẵn"
      if (chosenTextOption === ODD) chosenOption = "Lẻ"
    }
    if (chosenTextOption === HIGH || chosenTextOption === LOW) {
      betType = "Tài xỉu";
      if (chosenTextOption === HIGH) chosenOption = "Tài"
      if (chosenTextOption === LOW) chosenOption = "Xỉu"
    }
  }
  if (type === XIEN) {
    betType = "Xiên"
    if (chosenTextOption === EVENHIGH) chosenOption = "Chẵn - Tài"
    if (chosenTextOption === EVENLOW) chosenOption = "Chẵn - Xỉu"
    if (chosenTextOption === ODDHIGH) chosenOption = "Lẻ - Tài"
    if (chosenTextOption === ODDLOW) chosenOption = "Lẻ - Xỉu"
  }
  if (type === LO) {
    betType = "100 số"
    chosenOption = chosenNumberOption
  }

  let betStatus = status
  if (status === WIN) {
    betStatus = "Đã thanh toán"
    if (type === EVENODDHIGHLOW) receivedAmount = amount * 1.9
    if (type === XIEN) receivedAmount = amount * 3.2
    if (type === LO) receivedAmount = amount * 70
  }
  if (status === LOSE) {
    betStatus = "Thua"
    receivedAmount = 0
  }

  return {
    username,
    amount,
    type: betType,
    chosenOption,
    result,
    receivedAmount,
    status: betStatus,
    createdAt
  }
}

const getLatestBetTotalAmount = async () => {
  const evenAmount = 0
  const oddAmount = 0
  const highAmount = 0
  const lowAmount = 0
  const lastUndoneResult = await Result.findOne({ value: -1 }).lean()
  if (!!lastUndoneResult) {
    const lastUndoneBets = await Bet
      .find(
        {
          resultId: lastUndoneResult._id,
          status: { $nin: [WIN, LOSE] },
        })
      .lean()
    for (const bet of lastUndoneBets) {
      const { chosenTextOption, amount } = bet
      if (chosenTextOption === EVEN) evenAmount += amount
      if (chosenTextOption === ODD) oddAmount += amount
      if (chosenTextOption === HIGH) highAmount += amount
      if (chosenTextOption === LOW) lowAmount += amount
    }
  }

  return { evenAmount, oddAmount, highAmount, lowAmount }
}

export default {
  createABet,
  cancelABet,
  getActiveBet,
  getRecentBets,
  getLatestBetTotalAmount
};
