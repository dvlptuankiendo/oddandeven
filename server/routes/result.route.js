import express from "express";
import resultController from "../controllers/result.controller.js";

const router = express.Router();

router.get("/", resultController.getResults);

export default router;
