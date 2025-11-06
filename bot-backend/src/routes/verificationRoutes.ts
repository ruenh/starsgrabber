import { Router } from "express";
import {
  verifyChannelSubscription,
  verifyBotActivation,
} from "../controllers/verificationController.js";

const router = Router();

// POST /verify/channel - Verify channel subscription
router.post("/channel", verifyChannelSubscription);

// POST /verify/bot - Verify bot activation
router.post("/bot", verifyBotActivation);

export default router;
