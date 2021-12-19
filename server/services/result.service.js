import Result from "../models/result.model.js";
import Bet from "../models/bet.model.js";
import User from "../models/user.model.js";

import {
  BET_STATUS,
  BET_TYPES,
  EVENODDHIGHLOW_OPTIONS,
  XIEN_OPTIONS,
} from "../utils/constants.js";

const { WIN, LOSE } = BET_STATUS;
const { EVENODDHIGHLOW, XIEN, LO } = BET_TYPES;
const { EVEN, ODD, HIGH, LOW } = EVENODDHIGHLOW_OPTIONS;
const { EVENLOW, EVENHIGH, ODDLOW, ODDHIGH } = XIEN_OPTIONS;

const getResults = async () => {
  const activeResult = await Result.findOne({ value: -1 }).lean();
  const results = await Result.find({ value: { $ne: -1 } })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const lastResult = results[0]?.value || "";
  const lowHighs = [];
  const evenOdds = [];

  for (const result of results.reverse()) {
    if (result.value < 50) {
      lowHighs.push("X");
    } else {
      lowHighs.push("T");
    }

    if (result.value % 2 === 0) {
      evenOdds.push("C");
    } else {
      evenOdds.push("L");
    }
  }

  return {
    activeResultId: activeResult?._id,
    lastResult,
    lowHighs,
    evenOdds,
  };
};

const calculateResult = async () => {
  // implement logic calculate result here

  return Math.round(Math.random() * 100);
};

const updateBettings = async (activeResult) => {
  if (!activeResult) return;
  const result = activeResult.value;
  const isEven = result % 2 === 0;
  const isOdd = !isEven;
  const isHigh = result > 49;
  const isLow = !isHigh;
  const activeBettings = await Bet.find({
    status: { $nin: [WIN, LOSE] },
    createdAt: { $gte: activeResult.createdAt },
  });
  for (const betting of activeBettings) {
    const { userId, type, amount, chosenTextOption, chosenNumberOption } =
      betting;
    let isWin = false;
    if (type === EVENODDHIGHLOW) {
      isWin =
        (chosenTextOption === EVEN && isEven) ||
        (chosenTextOption === ODD && isOdd) ||
        (chosenTextOption === HIGH && isHigh) ||
        (chosenTextOption === LOW && isLow);
    }

    if (type === XIEN) {
      isWin =
        (chosenTextOption === EVENHIGH && isEven && isHigh) ||
        (chosenTextOption === EVENLOW && isEven && isLow) ||
        (chosenTextOption === ODDHIGH && isOdd && isHigh) ||
        (chosenTextOption === ODDLOW && isOdd && isLow);
    }

    if (type === LO) {
      isWin = result === chosenNumberOption;
    }

    if (isWin) {
      const user = await User.findOne({ _id: userId });
      if (user) {
        user.amount = user.amount + amount * 1.9;
        await user.save();
      }
    }

    betting.status = isWin ? WIN : LOSE;
    await betting.save();
  }
};

const createNewResult = async () => {
  const result = await calculateResult();
  const activeResult = await Result.findOne({ value: -1 });

  if (activeResult) {
    activeResult.value = result;
    await activeResult.save();
  }

  await updateBettings(activeResult);

  const newResult = new Result({
    value: -1,
  });

  await newResult.save();
};

export default { getResults, createNewResult };
