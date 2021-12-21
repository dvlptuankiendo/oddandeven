import betService from "../services/bet.service.js";

const createABet = async (req, res) => {
    try {
        const { userId } = req
        const { type, amount, chosenTextOption, chosenNumberOption } = req.body;
        const result = await betService.createABet(userId, type, chosenTextOption, chosenNumberOption, amount);
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

const getActiveBetting = async (req, res) => {
    try {
        const { userId } = req
        const result = await betService.getActiveBet(userId);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

const getRecentBets = async (req, res) => {
    try {
        const { userId } = req
        const { isOnlyFromUser, count } = req.query
        const result = await betService.getRecentBets(userId, isOnlyFromUser, count);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

export default {
    createABet,
    cancelABet,
    getActiveBetting,
    getRecentBets
};
