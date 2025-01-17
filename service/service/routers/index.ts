import express from "express";
import adminRouter from "./admin-router";
import userRouter from "./user-router";
import chatbotRouter from "./chatbot-router";
import paymentRouter from "./payment-router";

const router = express.Router();

// Mount routers
router.use("/admin", adminRouter);
router.use("/users", userRouter);
router.use("/chatbot", chatbotRouter);
router.use("/payments", paymentRouter);

export default router;
