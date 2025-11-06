import { NotificationService } from "../services/notificationService.js";
import { logger } from "../utils/logger.js";

/**
 * Controller for handling notification requests
 * These methods can be called from the API backend
 */
export class NotificationController {
  /**
   * Handle new task notification
   */
  static async handleNewTaskNotification(data: {
    taskTitle: string;
    reward: number;
    taskType: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      await NotificationService.notifyNewTask(
        data.taskTitle,
        data.reward,
        data.taskType
      );
      return { success: true, message: "Notifications sent" };
    } catch (error) {
      logger.error("Error handling new task notification:", error);
      return { success: false, message: "Failed to send notifications" };
    }
  }

  /**
   * Handle referral completion notification
   */
  static async handleReferralCompletionNotification(data: {
    userId: number;
    referralName: string;
    earnings: number;
    taskTitle: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      await NotificationService.notifyReferralCompletion(
        data.userId,
        data.referralName,
        data.earnings,
        data.taskTitle
      );
      return { success: true, message: "Notification sent" };
    } catch (error) {
      logger.error("Error handling referral completion notification:", error);
      return { success: false, message: "Failed to send notification" };
    }
  }

  /**
   * Handle withdrawal approval notification
   */
  static async handleWithdrawalApprovalNotification(data: {
    userId: number;
    amount: number;
  }): Promise<{ success: boolean; message: string }> {
    try {
      await NotificationService.notifyWithdrawalApproved(
        data.userId,
        data.amount
      );
      return { success: true, message: "Notification sent" };
    } catch (error) {
      logger.error("Error handling withdrawal approval notification:", error);
      return { success: false, message: "Failed to send notification" };
    }
  }

  /**
   * Handle withdrawal rejection notification
   */
  static async handleWithdrawalRejectionNotification(data: {
    userId: number;
    amount: number;
    reason: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      await NotificationService.notifyWithdrawalRejected(
        data.userId,
        data.amount,
        data.reason
      );
      return { success: true, message: "Notification sent" };
    } catch (error) {
      logger.error("Error handling withdrawal rejection notification:", error);
      return { success: false, message: "Failed to send notification" };
    }
  }

  /**
   * Handle admin withdrawal request notification
   */
  static async handleAdminWithdrawalRequestNotification(data: {
    username: string;
    amount: number;
    userId: number;
    withdrawalId: number;
  }): Promise<{ success: boolean; message: string }> {
    try {
      await NotificationService.notifyAdminWithdrawalRequest(
        data.username,
        data.amount,
        data.userId,
        data.withdrawalId
      );
      return { success: true, message: "Notification sent" };
    } catch (error) {
      logger.error("Error handling admin withdrawal notification:", error);
      return { success: false, message: "Failed to send notification" };
    }
  }
}
