import Bet from "../models/bet.model.js"
import Ranking from "../models/ranking.model.js"
import { getLocalBeginTodayTimestamp } from "../utils/helper.js";
import { WIN, LOSE } from "../utils/constants.js"

const getDailyRanking = async () => {
  const topUser = await Ranking
    .findOne()
    .sort({ createdAt: -1 })
    .populate({
      path: 'users',
      populate: 'userId'
    })
    .select('users')

  const data = topUser.users.map((u, idx) => { return { top: idx + 1, username: u.userId.username, amount: u.amount } })

  return data
};

const updateDailyRanking = async (quantity) => {
  const top = quantity || 7;

  const localStartOfDayTimeStamp = getLocalBeginTodayTimestamp()

  const nowMoment = new Date()
  const nowMomentTimeStamp = nowMoment.getTime()

  const todayBets = await Bet
    .find({
      createdAt: { $gte: localStartOfDayTimeStamp, $lte: nowMomentTimeStamp },
      status: { $in: [WIN, LOSE] }
    })
    .populate('userId')
    .lean()

  // Is there a way that only using mongoose query???

  const topUsers = []
  for (const bet of todayBets) {
    const existUser = topUsers.find(u => u.userId === bet.userId._id)
    if (!!existUser) {
      existUser.amount += bet.amount
    }
    else {
      const newUserEntry = {
        userId: bet.userId._id,
        amount: bet.amount
      }
      topUsers.push(newUserEntry)
    }
  }

  const usersToBeInserted = topUsers
    .sort((u1, u2) => u1.amount < u2.amount ? 1 : -1)
    .slice(0, top)

  const newRanking = new Ranking({
    users: usersToBeInserted,
  })

  await newRanking.save()
};

export default {
  getDailyRanking,
  updateDailyRanking
};