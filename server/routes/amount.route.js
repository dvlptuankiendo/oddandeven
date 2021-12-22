import express from "express";
import amountController from "../controllers/amount.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/deposit/momo", auth, amountController.depositMomo);

router.post("/deposit/tsr", auth, amountController.depositTSR);

export default router;
