import express from "express";
import betController from "../controllers/bet.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createABet", betController.createABet);
router.post("/cancelABet/:betId", betController.cancelABet);
router.get("/active", auth, betController.getActiveBetting);
router.get("/recent", auth, betController.getRecentBets);
router.get("/latestTotalAmount", betController.getLatestBetTotalAmount);

export default router;
