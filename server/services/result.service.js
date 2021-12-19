import Result from "../models/result.model.js";

const getResults = async () => {
  const results = await Result.find().sort({ createdAt: -1 }).limit(10).lean();

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
    lastResult,
    lowHighs,
    evenOdds,
  };
};

export default { getResults };
