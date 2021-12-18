import resultService from "../services/result.service.js";

const getResults = async (req, res) => {
  try {
    const result = await resultService.getResults();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

export default {
  getResults,
};
