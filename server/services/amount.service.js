import axios from "axios";
import _ from "lodash";
import dotenv from "dotenv";
import moment from "moment";

import User from "../models/user.model.js";
import WithDraw from "../models/withdraw.model.js";

import {
  TRANSACTION_OPTIONS,
  TRANSACTION_PROVIDERS,
  MOMO_RATE,
  TSR_RATE,
} from "../utils/constants.js";

dotenv.config();

const { DEPOSIT } = TRANSACTION_OPTIONS;
const { MOMO, THESIEURE } = TRANSACTION_PROVIDERS;

const momoUrl = process.env.MOMO_URL;
const thesieureUrl = process.env.THE_SIEU_RE_URL;

const depositMomo = async (userId) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Exception("Bad request");

  if (user.isProcessing)
    throw new Error("Đang xử lý giao dịch. Vui lòng thử lại sau");

  try {
    user.isProcessing = true;
    await user.save();

    // get momo transactions
    const res = await axios.get(momoUrl);
    const {
      data: {
        momoMsg: { tranList },
      },
    } = res;

    // get last 1 hour transations
    const now = Date.now();
    const miliSecondsIn1Hour = 1 * 60 * 60 * 1000;
    const transactions = tranList.filter(
      (item) => now - item.finishTime <= miliSecondsIn1Hour
    );

    // find user transactions
    const existedTransactionIds = (user.history || [])
      .filter((item) => item.type === DEPOSIT && item.provider === MOMO)
      .map((item) => item.externalId)
      .flat();

    const validTransactions = transactions.filter((item) => {
      try {
        if (item.desc !== "Thành công") return false;
        if (existedTransactionIds.includes(item.ID)) return false;
        if (item.comment !== user.username) return false;

        const accountPhoneNumber = item.user;
        const extras = JSON.parse(item.extras);
        const { ORIGINAL_PARTNER_ID } = extras;
        const isReceiver = ORIGINAL_PARTNER_ID === accountPhoneNumber;
        if (!isReceiver) return false;

        return true;
      } catch (err) {
        console.error(err.message);
        return false;
      }
    });

    if (!validTransactions.length)
      throw new Error("Vui lòng gửi tiền theo hướng dẫn rồi bấm Nạp tiền");

    // update user amount && history
    const transactionIds = validTransactions.map((item) => item.ID);
    const totalAmount = _.sumBy(validTransactions, (i) => i.amount);

    const goldAmount = totalAmount * MOMO_RATE;

    const newDeposit = {
      type: DEPOSIT,
      provider: MOMO,
      goldAmount,
      amount: totalAmount,
      externalId: transactionIds,
    };

    if (!user.history || !user.history.length) {
      user.history = [newDeposit];
    } else {
      user.history.push(newDeposit);
    }

    user.amount = user.amount + goldAmount;
    user.isProcessing = false;
    await user.save();
  } catch (err) {
    user.isProcessing = false;
    await user.save();
    throw err;
  }
};

const depositTSR = async (userId, code) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Exception("Bad request");

  if (user.isProcessing)
    throw new Error("Đang xử lý giao dịch. Vui lòng thử lại sau");

  try {
    user.isProcessing = true;
    await user.save();

    // get TSR transactions
    const res = await axios.get(thesieureUrl);
    const { data } = res.data;

    // find user transactions
    const existedTransactionIds = (user.history || [])
      .filter((item) => item.type === DEPOSIT && item.provider === THESIEURE)
      .map((item) => item.externalId)
      .flat();

    const validTransactions = data.filter((item) => {
      return (
        item.noidung === user.username &&
        item.magd === code &&
        !existedTransactionIds.includes(item.magd)
      );
    });

    if (!validTransactions.length)
      throw new Error("Vui lòng gửi tiền theo hướng dẫn rồi bấm Nạp tiền");

    // update user amount && history
    const transactionIds = validTransactions.map((item) => item.magd);
    const totalAmount = _.sumBy(validTransactions, (i) =>
      Number(i.sotien.replace(/[^0-9]/g, ""))
    );

    const goldAmount = totalAmount * TSR_RATE;

    const newDeposit = {
      type: DEPOSIT,
      provider: THESIEURE,
      goldAmount,
      amount: totalAmount,
      externalId: transactionIds,
    };

    if (!user.history || !user.history.length) {
      user.history = [newDeposit];
    } else {
      user.history.push(newDeposit);
    }

    user.amount = user.amount + goldAmount;
    user.isProcessing = false;
    await user.save();
  } catch (err) {
    user.isProcessing = false;
    await user.save();
    throw err;
  }
};

const requestWithdraw = async (userId, { provider, amount, address }) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error("Bad request");

  if (![MOMO, THESIEURE].includes(provider)) throw new Error("Ví không hợp lệ");

  if (!address || !address.trim()) throw new Error("Địa chỉ không hợp lệ");

  if (!amount || amount < 10000000 || amount % 1 !== 0)
    throw new Error("Số dư không hợp lệ");

  if (!user.amount || user.amount < amount) throw new Error("Không đủ số dư");

  user.amount = user.amount - amount;
  await user.save();

  const request = new WithDraw({
    userId: user._id,
    amount,
    provider,
  });
  await request.save();
};

export default { depositMomo, depositTSR, requestWithdraw };

// const tsrDataStructure = {
//   status: "1",
//   msg: "Thành công",
//   data: [
//     {
//       magd: "T61C32AA318752",
//       sotien: "10000",
//       noidung: "test123",
//       loai: "cộng tiền",
//     },
//   ],
// };
