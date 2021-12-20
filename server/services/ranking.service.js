import Bet from "../models/bet.model.js";
import Ranking from "../models/ranking.model.js";
import { getLocalBeginTodayTimestamp } from "../utils/helper.js";
import { BET_STATUS } from "../utils/constants.js";
import User from "../models/user.model.js";

const { WIN, LOSE } = BET_STATUS;

const rewards = [
  500000000, 250000000, 100000000, 75000000, 50000000, 40000000, 30000000,
];

const getDailyRanking = async () => {
  const localStartOfDayTimeStamp = getLocalBeginTodayTimestamp();

  const todayBets = await Bet
    .find({
      createdAt: { $gte: localStartOfDayTimeStamp },
      status: { $in: [WIN, LOSE] }
    })
    .populate('userId')
    .select("userId");

  const filtedtodayBetsByUser = []
  for (const bet of todayBets) {
    const existBetWithUser = filtedtodayBetsByUser.find(b => b.userId.username === bet.userId.username)
    if (!existBetWithUser) filtedtodayBetsByUser.push(bet)
  }

  const data = filtedtodayBetsByUser
    .sort((b1, b2) => (b1.userId.amountPlayedToday < b2.userId.amountPlayedToday ? 1 : -1))
    .slice(0, 7)
    .map((b, idx) => {
      return {
        top: idx + 1,
        username: b.userId.username,
        amount: b.userId.amountPlayedToday,
        reward: rewards[idx],
      }
    })

  return data
};

const updateDailyRanking = async () => {
  const top = 7;

  const localStartOfDayTimeStamp = getLocalBeginTodayTimestamp();

  const nowMoment = new Date();
  const nowMomentTimeStamp = nowMoment.getTime();

  const todayBets = await Bet.find({
    createdAt: { $gte: localStartOfDayTimeStamp, $lte: nowMomentTimeStamp },
    status: { $in: [WIN, LOSE] },
  }).lean();

  // Is there a way that only using mongoose query???

  const topUsers = [];
  for (const bet of todayBets) {
    const existUser = topUsers.find((u) => u.userId === bet.userId);
    if (!!existUser) {
      existUser.amount += bet.amount;
    } else {
      const newUserEntry = {
        userId: bet.userId,
        amount: bet.amount,
      };
      topUsers.push(newUserEntry);
    }
  }

  const usersToBeInserted = topUsers
    .sort((u1, u2) => (u1.amount < u2.amount ? 1 : -1))
    .slice(0, top);

  for (let [index, item] of usersToBeInserted.entries()) {
    const { userId } = item;
    const user = await User.findOne({ _id: userId });
    if (user) {
      user.amount = user.amount + rewards[index];
      await user.save();
    }
  }

  const newRanking = new Ranking({
    users: usersToBeInserted,
  });

  await newRanking.save();
};

const resetAmountPlayedToday = async () => {
  await User.updateMany({}, { amountPlayedToday: 0 })
}

export default {
  getDailyRanking,
  updateDailyRanking,
  resetAmountPlayedToday
};
