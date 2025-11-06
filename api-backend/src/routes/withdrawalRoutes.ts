import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { withdrawalLimiter } from "../middleware/rateLimiter.js";
import { validateWithdrawalInput } from "../middleware/validation.js";
import {
  createWithdrawal,
  getWithdrawals,
} from "../controllers/withdrawalController.js";

const router = Router();

// All withdrawal routes require authentication
router.use(authenticateToken);

/**
 * POST /api/withdrawals
 * Create a new withdrawal request
 */
router.post("/", withdrawalLimiter, validateWithdrawalInput, createWithdrawal);

/**
 * GET /api/withdrawals
 * Get user's withdrawal history
 */
router.get("/", getWithdrawals);

export default router;
