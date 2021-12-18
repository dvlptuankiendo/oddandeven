import betService from "../services/bet.service.js";

const createABet = async (req, res) => {
    try {
        const { userId } = req
        const { type, amount, chosenOption } = req.body;
        const result = await betService.createABet(userId, type, chosenOption, amount);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

const cancelABet = async (req, res) => {
    try {
        const { userId } = req
        const { betId } = req.params;
        const result = await betService.cancelABet(userId, betId);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

export default {
    createABet,
    cancelABet
};
