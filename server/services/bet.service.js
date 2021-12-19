import { MIN_BET_AMOUNT, EVENODDHIGHLOW_OPTIONS, BET_STATUS, BET_TYPES, XIEN_OPTIONS } from "../utils/constants.js"
import User from "../models/user.model.js";
import Bet from "../models/bet.model.js";

const { EVENODDHIGHLOW, XIEN, LO } = BET_TYPES
const { ODDHIGH, ODDLOW, EVENHIGH, EVENLOW } = XIEN_OPTIONS
const { LOW, HIGH, EVEN, ODD } = EVENODDHIGHLOW_OPTIONS
const { WIN, LOSE } = BET_STATUS

const createABet = async (userId, type, chosenTextOption, chosenNumberOption, amount) => {
    const existUser = await User.findOne({ _id: userId }).lean();
    if (!existUser) throw new Error("Người dùng không tồn tại");

    //logic check if exist pending bet ???

    if (![EVENODDHIGHLOW, XIEN, LO].includes(type)) throw new Error("Vui lòng chọn trò chơi")

    const invalidEvenOddHighLow = (type === EVENODDHIGHLOW && ![LOW, HIGH, EVEN, ODD].includes(chosenTextOption))
    const invalidXien = (type === XIEN && ![ODDHIGH, ODDLOW, EVENHIGH, EVENLOW].includes(chosenTextOption))
    const invalidLo = false
    if (type === LO) {
        try {
            const number = parseInt(chosenNumberOption)
            if (Number.isNaN(number) || number > 99 || number < 0) invalidLo = true
        } catch (error) {
            throw new Error("Lựa chọn không hợp lệ")
        }
    }
    if (invalidEvenOddHighLow || invalidXien || invalidLo) throw new Error("Lựa chọn không hợp lệ")

    if (!amount || amount < MIN_BET_AMOUNT) throw new Error(`Số tiền đặt cược tối thiểu là ${MIN_BET_AMOUNT}$`);

    if (existUser.amount < amount) throw new Error(`Số dư tài khoản hiện tại không đủ, vui lòng nạp thêm`);

    //logic prevent creating a bet at last 15 seconds or when calculating result ???

    await User.findByIdAndUpdate(existUser._id, { amount: existUser.amount - amount })

    const newBet = new Bet({
        userId,
        type,
        amount,
    })

    if ([EVENODDHIGHLOW, XIEN].includes(type)) newBet.chosenTextOption = chosenTextOption
    if (type === LO) newBet.chosenNumberOption = chosenNumberOption

    await newBet.save();
    return { id: newBet._id };
};

const cancelABet = async (userId, betId) => {
    const existPendingBet = await Bet.findOne({ _id: betId, userId, status: { $nin: [WIN, LOSE] } }).lean();
    if (!existPendingBet) throw new Error("Lệnh cược không tồn tại ");

    const existUser = await User.findOne({ _id: userId }).lean();
    if (!existUser) throw new Error("Người dùng không tồn tại");

    const { amount } = existPendingBet

    await Bet.findByIdAndDelete(betId);

    await User.findByIdAndUpdate(existUser._id, { amount: existUser.amount + amount })

    return { id: existPendingBet._id };
}

export default {
    createABet,
    cancelABet
};
