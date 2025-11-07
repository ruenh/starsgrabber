import { Router } from "express";
import { login } from "../controllers/authController.js";
import { validateInitData } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
const router = Router();
/**
 * POST /api/auth/login
 * Login or register user with Telegram initData
 * Body: { initData: string, referralCode?: string }
 */
router.post("/login", authLimiter, validateInitData, login);
export default router;
//# sourceMappingURL=authRoutes.js.map