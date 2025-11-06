import axios from "axios";
import { logger } from "../utils/logger.js";

const BOT_BACKEND_URL = process.env.BOT_BACKEND_URL || "http://localhost:3001";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";

/**
 * Service for sending notifications via Bot Backend
 */
export class NotificationService {
  private static async sendRequest(
    endpoint: string,
    data: any
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${BOT_BACKEND_URL}/notifications/${endpoint}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": INTERNAL_API_KEY,
          },
          timeout: 10000,
        }
      );

      if (response.data.success) {
        logger.info(`Notification sent successfully: ${endpoint}`);
        return true;
      } else {
        logger.warn(`Notification failed: ${endpoint}`, response.data);
        return false;
      }
    } catch (error) {
      logger.error(`Error sending notification to ${endpoint}:`, error);
      return false;
    }
  }

  /**
   * Notify all users about a new task
   * Requirement 14.1: WHEN new Task is created, THE Bot Backend SHALL send notification message to all Users
   */
  static async notifyNewTask(
    taskTitle: string,
    reward: number,
    taskType: string
  ): Promise<boolean> {
    return this.sendRequest("new-task", { taskTitle, reward, taskType });
  }

  /**
   * Notify user about referral completion
   * Requirement 14.2: WHEN Referral completes Task, THE Bot Backend SHALL send notification to referrer User
   */
  static async notifyReferralCompletion(
    userId: number,
    referralName: string,
    earnings: number,
    taskTitle: string
  ): Promise<boolean> {
    return this.sendRequest("referral-completion", {
      userId,
      referralName,
      earnings,
      taskTitle,
    });
  }

  /**
   * Notify user about withdrawal approval
   * Requirement 14.3: WHEN Withdrawal Request is approved, THE Bot Backend SHALL send notification to User
   */
  static async notifyWithdrawalApproved(
    userId: number,
    amount: number
  ): Promise<boolean> {
    return this.sendRequest("withdrawal-approved", { userId, amount });
  }

  /**
   * Notify user about withdrawal rejection
   * Requirement 14.4: WHEN Withdrawal Request is rejected, THE Bot Backend SHALL send notification to User with reason
   */
  static async notifyWithdrawalRejected(
    userId: number,
    amount: number,
    reason: string
  ): Promise<boolean> {
    return this.sendRequest("withdrawal-rejected", { userId, amount, reason });
  }

  /**
   * Notify admin about new withdrawal request
   * Requirement 14.5: WHEN Withdrawal Request is created, THE Bot Backend SHALL send notification to Admin
   */
  static async notifyAdminWithdrawalRequest(
    username: string,
    amount: number,
    userId: number,
    withdrawalId: number
  ): Promise<boolean> {
    return this.sendRequest("admin-withdrawal-request", {
      username,
      amount,
      userId,
      withdrawalId,
    });
  }
}
