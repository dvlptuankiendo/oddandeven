import axios from "axios";
import _ from "lodash";

import User from "../models/user.model.js";
import {
  TRANSACTION_OPTIONS,
  TRANSACTION_PROVIDERS,
  MOMO_RATE,
} from "../utils/constants.js";

const { DEPOSIT } = TRANSACTION_OPTIONS;
const { MOMO, THESIEURE } = TRANSACTION_PROVIDERS;

const momoUrl = process.env.MOMO_URL;
const thesieureUrl = process.env.THE_SIEU_RE_URL;

const depositMomo = async (userId) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Exception("Bad request");

  if (user.isProcessing)
    throw new Error("Đang xử lý giao dịch. Vui lòng thử lại sau");

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
  const miliSecondsIn1Hour = 1 * 60 * 1000;
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
      if (item.comment !== username) return false;

      const accountPhoneNumber = item.user;
      const extras = JSON.parse(item.extras);
      const { receiverMembers } = extras;
      const receiver = receiverMembers[0];
      const isReceiver = receiver.receiverNumber === accountPhoneNumber;
      if (!isReceiver) return false;

      return true;
    } catch {
      return false;
    }
  });

  if (!validTransactions.length)
    throw new Error("Vui lòng gửi tiền theo hướng dẫn rồi bấm Nạp tiền");

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

  user.amount = user.amount + totalAmount;
  user.isProcessing = false;
  await user.save();
};

export default { depositMomo };
