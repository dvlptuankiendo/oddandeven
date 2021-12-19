import Result from "../models/result.model.js";

const getResults = async () => {
  const activeResult = await Result.findOne({ value: -1 }).lean();
  const results = await Result.find({ value: { $ne: -1 } })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const lastResult = results[0].value;
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

const createNewResult = async () => {
  const result = await calculateResult();
  const activeResult = await Result.findOne({ value: -1 });

  if (activeResult) {
    activeResult.value = result;
    await activeResult.save();
  }

  const newResult = new Result({
    value: -1,
  });

  await newResult.save();
};

export default { getResults, createNewResult };
