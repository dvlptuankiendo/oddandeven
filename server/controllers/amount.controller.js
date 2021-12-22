import amountService from "../services/amount.service.js";

const depositMomo = async (req, res) => {
  try {
    const { userId } = req;
    await amountService.depositMomo(userId);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const depositTSR = async (req, res) => {
  try {
    const { userId } = req;
    const { code } = req.body;
    await amountService.depositTSR(userId, code);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

export default { depositMomo, depositTSR };
