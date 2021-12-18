import rankingService from "../services/ranking.service.js";

const getDailyRanking = async (req, res) => {
  try {
    const result = await rankingService.getDailyRanking();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

export default {
  getDailyRanking,
};
