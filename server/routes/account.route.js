import express from "express";
import accountController from "../controllers/account.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/logIn", accountController.logIn);
router.post("/register", accountController.register);
router.get("/me", accountController.getInfo);
router.get("/history", auth, accountController.getHistory);

export default router;
