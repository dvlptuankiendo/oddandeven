import Result from "../models/result.model.js";

const getResults = async () => {
  const results = await Result.find().sort({ createdAt: -1 }).take(10).lean();

  return results;
};

export default { getResults };
