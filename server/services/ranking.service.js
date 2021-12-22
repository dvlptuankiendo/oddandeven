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
  const topUsers = await User
    .find({ amountPlayedToday: { $gt: 0 } })
    .sort({ amountPlayedToday: -1 })
    .limit(7)
    .lean()

  const data = topUsers
    .map((u, idx) => {
      return {
        top: idx + 1,
        username: u.username,
        amount: u.amountPlayedToday,
        reward: rewards[idx],
      }
    })

  return data
};

const updateDailyRanking = async () => {
  const topUsers = await User
    .find({ amountPlayedToday: { $gt: 0 } })
    .sort({ amountPlayedToday: -1 })
    .limit(7)

  for (let [index, user] of topUsers.entries()) {
    user.amount = user.amount + rewards[index];
    await user.save();
  }

  //reset AmountPlayedToday of all users
  await User.updateMany({}, { amountPlayedToday: 0 })
};

export default {
  getDailyRanking,
  updateDailyRanking,
};
