import { Router } from "express";
import { getTasks, verifyTask } from "../controllers/taskController.js";
import { authenticateToken } from "../middleware/auth.js";
import { verificationLimiter } from "../middleware/rateLimiter.js";
import { validateTaskId } from "../middleware/validation.js";
const router = Router();
// All task routes require authentication
router.use(authenticateToken);
// GET /api/tasks - Get all tasks with completion status
router.get("/", getTasks);
// POST /api/tasks/:id/verify - Verify task completion
router.post("/:id/verify", verificationLimiter, validateTaskId, verifyTask);
export default router;
//# sourceMappingURL=taskRoutes.js.map