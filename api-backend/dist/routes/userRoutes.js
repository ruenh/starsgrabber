import { Router } from "express";
import { getProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
const router = Router();
/**
 * GET /api/user/profile
 * Get authenticated user's profile
 * Requires: Authorization header with JWT token
 */
router.get("/profile", authenticateToken, getProfile);
export default router;
//# sourceMappingURL=userRoutes.js.map