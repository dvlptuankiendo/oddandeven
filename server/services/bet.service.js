import { MIN_BET_AMOUNT, LOWHIGH, EVENODD, WIN, LOSE, LOW, HIGH, EVEN, ODD } from "../utils/constants.js"
import User from "../models/user.model.js";
import Bet from "../models/bet.model.js";

const createABet = async (userId, type, chosenOption, amount) => {
    const existUser = await User.findOne({ _id: userId }).lean();
    if (!existUser) throw new Error("User is not exist");

    //logic check if exist pending bet ???

    if (![LOWHIGH, EVENODD].includes(type)) throw new Error("Bet type is not valid")

    const invalidLowHigh = type === LOWHIGH && ![LOW, HIGH].includes(chosenOption)
    const invalidEvenOdd = type === EVENODD && ![EVEN, ODD].includes(chosenOption)

    if (invalidLowHigh || invalidEvenOdd) throw new Error("Bet option is not valid")

    if (!amount || amount < MIN_BET_AMOUNT) throw new Error(`Amount must be greater than or equal to ${MIN_BET_AMOUNT}$`);

    if (existUser.amount < amount) throw new Error(`Amount of account is currently lower than ${MIN_BET_AMOUNT}$`);

    //logic prevent creating a bet at last 15 seconds or when calculating result ???

    await User.findByIdAndUpdate(existUser._id, { amount: existUser.amount - amount })

    const newBet = new Bet({
        userId,
        type,
        amount,
        chosenOption
    })

    await newBet.save();
    return { id: newBet._id };
};

const cancelABet = async (userId, betId) => {
    const existPendingBet = await Bet.findOne({ _id: betId, userId, status: { $nin: [WIN, LOSE] } }).lean();
    if (!existPendingBet) throw new Error("No pending bet exist");

    const existUser = await User.findOne({ _id: userId }).lean();
    if (!existUser) throw new Error("User is not exist");

    const { amount } = existPendingBet

    await Bet.findByIdAndDelete(betId);

    await User.findByIdAndUpdate(existUser._id, { amount: existUser.amount + amount })

    return { id: existPendingBet._id };
}

export default {
    createABet,
    cancelABet
};
