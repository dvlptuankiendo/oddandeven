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

export default { depositMomo };
