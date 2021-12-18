import express from "express";
import betController from "../controllers/bet.controller.js";

const router = express.Router();

router.post("/createABet", betController.createABet);
router.post("/cancelABet/:betId", betController.cancelABet);

export default router;
