import { Router, Request, Response, NextFunction } from "express";
import { NotificationController } from "../controllers/notificationController.js";
import { logger } from "../utils/logger.js";

const router = Router();

/**
 * Middleware to verify requests are from API backend
 */
const verifyApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"];
  const expectedKey = process.env.INTERNAL_API_KEY;

  if (!expectedKey) {
    logger.warn("INTERNAL_API_KEY not configured");
    next();
    return;
  }

  if (apiKey !== expectedKey) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};

/**
 * POST /notifications/new-task
 * Notify all users about a new task
 */
router.post(
  "/new-task",
  verifyApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskTitle, reward, taskType } = req.body;

      if (!taskTitle || !reward || !taskType) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const result = await NotificationController.handleNewTaskNotification({
        taskTitle,
        reward,
        taskType,
      });

      res.json(result);
    } catch (error) {
      logger.error("Error in new-task notification route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /notifications/referral-completion
 * Notify user about referral completion
 */
router.post(
  "/referral-completion",
  verifyApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, referralName, earnings, taskTitle } = req.body;

      if (!userId || !referralName || !earnings || !taskTitle) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const result =
        await NotificationController.handleReferralCompletionNotification({
          userId,
          referralName,
          earnings,
          taskTitle,
        });

      res.json(result);
    } catch (error) {
      logger.error("Error in referral-completion notification route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /notifications/withdrawal-approved
 * Notify user about withdrawal approval
 */
router.post(
  "/withdrawal-approved",
  verifyApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, amount } = req.body;

      if (!userId || !amount) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const result =
        await NotificationController.handleWithdrawalApprovalNotification({
          userId,
          amount,
        });

      res.json(result);
    } catch (error) {
      logger.error("Error in withdrawal-approved notification route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /notifications/withdrawal-rejected
 * Notify user about withdrawal rejection
 */
router.post(
  "/withdrawal-rejected",
  verifyApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, amount, reason } = req.body;

      if (!userId || !amount || !reason) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const result =
        await NotificationController.handleWithdrawalRejectionNotification({
          userId,
          amount,
          reason,
        });

      res.json(result);
    } catch (error) {
      logger.error("Error in withdrawal-rejected notification route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /notifications/admin-withdrawal-request
 * Notify admin about new withdrawal request
 */
router.post(
  "/admin-withdrawal-request",
  verifyApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, amount, userId, withdrawalId } = req.body;

      if (!username || !amount || !userId || !withdrawalId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const result =
        await NotificationController.handleAdminWithdrawalRequestNotification({
          username,
          amount,
          userId,
          withdrawalId,
        });

      res.json(result);
    } catch (error) {
      logger.error(
        "Error in admin-withdrawal-request notification route:",
        error
      );
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
