import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { adminLimiter } from "../middleware/rateLimiter.js";
import {
  validateTaskInput,
  validateTaskId,
  validateWithdrawalId,
  validateBannerInput,
} from "../middleware/validation.js";
import {
  createBannerAdmin,
  updateBannerAdmin,
  deleteBannerAdmin,
  getAllBannersAdmin,
} from "../controllers/bannerController.js";
import {
  getAllTasksAdmin,
  createTaskAdmin,
  updateTaskAdmin,
  closeTaskAdmin,
  getPendingWithdrawalsAdmin,
  approveWithdrawalAdmin,
  rejectWithdrawalAdmin,
  getStatsAdmin,
  getReferralTreeAdmin,
} from "../controllers/adminController.js";

const router = Router();

// All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);
router.use(adminLimiter);

// Task management routes
router.get("/tasks", getAllTasksAdmin);
router.post("/tasks", validateTaskInput, createTaskAdmin);
router.put("/tasks/:id", validateTaskId, validateTaskInput, updateTaskAdmin);
router.patch("/tasks/:id/close", validateTaskId, closeTaskAdmin);

// Withdrawal management routes
router.get("/withdrawals", getPendingWithdrawalsAdmin);
router.post(
  "/withdrawals/:id/approve",
  validateWithdrawalId,
  approveWithdrawalAdmin
);
router.post(
  "/withdrawals/:id/reject",
  validateWithdrawalId,
  rejectWithdrawalAdmin
);

// Statistics and monitoring routes
router.get("/stats", getStatsAdmin);
router.get("/referral-tree", getReferralTreeAdmin);

// Banner management routes
router.get("/banners", getAllBannersAdmin);
router.post("/banners", validateBannerInput, createBannerAdmin);
router.put("/banners/:id", validateBannerInput, updateBannerAdmin);
router.delete("/banners/:id", deleteBannerAdmin);

export default router;
