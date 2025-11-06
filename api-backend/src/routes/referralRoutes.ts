import { Router } from "express";
import { getReferrals } from "../controllers/referralController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// All referral routes require authentication
router.use(authenticateToken);

/**
 * GET /api/referrals
 * Get referral statistics and link for authenticated user
 */
router.get("/", getReferrals);

export default router;
