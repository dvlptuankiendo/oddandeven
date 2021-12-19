import accountService from "../services/account.service.js";

const logIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await accountService.logIn(username, password);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await accountService.register(username, password);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const getInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Thông tin không hợp lệ");
    const result = await accountService.getInfo(token);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const { userId } = req;
    const result = await accountService.getHistory(userId);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

export default {
  logIn,
  register,
  getInfo,
  getHistory,
};
