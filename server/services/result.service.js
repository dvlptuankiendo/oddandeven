import _ from "lodash";

import Result from "../models/result.model.js";
import Bet from "../models/bet.model.js";
import User from "../models/user.model.js";

import {
  BET_STATUS,
  BET_TYPES,
  EVENODDHIGHLOW_OPTIONS,
  XIEN_OPTIONS,
  RESULTS,
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

const calculateResult = async (activeResult) => {
  if (!activeResult) return;

  const activeBettings = await Bet.find({
    status: { $nin: [WIN, LOSE] },
    createdAt: { $gte: activeResult.createdAt },
  }).lean();

  const odd = activeBettings.filter(
    (item) => EVENODDHIGHLOW === item.type && ODD === item.chosenTextOption
  );
  const even = activeBettings.filter(
    (item) => EVENODDHIGHLOW === item.type && EVEN === item.chosenTextOption
  );
  const low = activeBettings.filter(
    (item) => EVENODDHIGHLOW === item.type && LOW === item.chosenTextOption
  );
  const high = activeBettings.filter(
    (item) => EVENODDHIGHLOW === item.type && HIGH === item.chosenTextOption
  );

  const oddLow = activeBettings.filter(
    (item) => XIEN === item.type && ODDLOW === item.chosenTextOption
  );
  const oddHigh = activeBettings.filter(
    (item) => XIEN === item.type && ODDHIGH === item.chosenTextOption
  );
  const evenLow = activeBettings.filter(
    (item) => XIEN === item.type && EVENLOW === item.chosenTextOption
  );
  const evenHigh = activeBettings.filter(
    (item) => XIEN === item.type && EVENHIGH === item.chosenTextOption
  );

  const chooseNumber = activeBettings.filter((item) => LO === item.type);

  const resultCases = {
    oddLow: {
      win19: [odd, low],
      win32: [oddLow],
    },
    oddHigh: {
      win19: [odd, high],
      win32: [oddHigh],
    },
    evenLow: {
      win19: [even, low],
      win32: [evenLow],
    },
    evenHigh: {
      win19: [even, high],
      win32: [evenHigh],
    },
  };

  const income = _.sumBy(activeBettings, (item) => item.amount);

  const profits = [];

  for (const key of Object.keys(resultCases)) {
    const item = resultCases[key];
    const { win19, win32 } = item;
    let outcome = 0;
    for (const win of win19) {
      outcome += _.sumBy(win, (i) => i.amount) * 1.9;
    }

    for (const win of win32) {
      outcome += _.sumBy(win, (i) => i.amount) * 3.2;
    }

    profits.push({ key, profit: income - outcome });
  }

  const sortedProfits = _.sortBy(profits, (p) => p.profit).reverse();
  const maxProfit = sortedProfits[0];
  const { key, profit } = maxProfit;

  const availableResults = RESULTS[key];

  const minChooseNumberAmount = _.minBy(chooseNumber, (i) => i.amount);
  if (minChooseNumberAmount) {
    const lessProfit = profit - minChooseNumberAmount.amount * 70;
    if (
      lessProfit > 0 &&
      availableResults.includes(minChooseNumberAmount.chosenNumberOption)
    ) {
      const random = Math.random();
      if (random < 0.15) {
        minChooseNumberAmount.chosenNumberOption;
      }
    }
  }

  return _.sample(availableResults);
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
    let isWinEvenOddHighLow = false;
    let isWinXien = false;
    let isWinLo = false;

    if (type === EVENODDHIGHLOW) {
      isWinEvenOddHighLow =
        (chosenTextOption === EVEN && isEven) ||
        (chosenTextOption === ODD && isOdd) ||
        (chosenTextOption === HIGH && isHigh) ||
        (chosenTextOption === LOW && isLow);
    }

    if (type === XIEN) {
      isWinXien =
        (chosenTextOption === EVENHIGH && isEven && isHigh) ||
        (chosenTextOption === EVENLOW && isEven && isLow) ||
        (chosenTextOption === ODDHIGH && isOdd && isHigh) ||
        (chosenTextOption === ODDLOW && isOdd && isLow);
    }

    if (type === LO) {
      isWinLo = result === chosenNumberOption;
    }

    const user = await User.findOne({ _id: userId });
    if (user) {
      if (isWinEvenOddHighLow) {
        user.amount = user.amount + amount * 1.9;
      }
      if (isWinXien) {
        user.amount = user.amount + amount * 3.2;
      }
      if (isWinLo) {
        user.amount = user.amount + amount * 70;
      }
      await user.save();
    }
    const isWin = isWinEvenOddHighLow || isWinXien || isWinLo;
    betting.status = isWin ? WIN : LOSE;
    betting.resultId = activeResult;
    await betting.save();
  }
};

const createNewResult = async () => {
  const activeResult = await Result.findOne({ value: -1 });
  const result = await calculateResult(activeResult);

  if (activeResult) {
    activeResult.value = result;
    await activeResult.save();
  }

  await updateBettings(activeResult);

  const newResult = new Result({
    value: -1,
  });

  await newResult.save();
  return result;
};

export default { getResults, createNewResult };
