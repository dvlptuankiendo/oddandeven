import express from "express";
import rankingController from "../controllers/ranking.controller.js";

const router = express.Router();

router.get("/daily", rankingController.getDailyRanking);

export default router;
