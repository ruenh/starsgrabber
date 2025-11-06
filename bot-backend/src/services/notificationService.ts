import { bot } from "../index.js";
import logger from "../utils/logger.js";
import { supabase } from "../config/supabase.js";

export class NotificationService {
  /**
   * Send notification to a user
   */
  static async notifyUser(userId: number, message: string): Promise<void> {
    try {
      await bot.api.sendMessage(userId, message, { parse_mode: "HTML" });
      logger.info(`Notification sent to user ${userId}`);
    } catch (error) {
      logger.error(`Failed to send notification to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Send notification about new task to all users
   * Requirement 14.1: WHEN new Task is created, THE Bot Backend SHALL send notification message to all Users
   */
  static async notifyNewTask(
    taskTitle: string,
    reward: number,
    taskType: string
  ): Promise<void> {
    try {
      logger.info(
        `Sending new task notification: ${taskTitle} (${reward} stars)`
      );

      // Fetch all users from database
      const { data: users, error } = await supabase
        .from("users")
        .select("telegram_id");

      if (error) {
        logger.error("Error fetching users for notification:", error);
        return;
      }

      if (!users || users.length === 0) {
        logger.info("No users to notify");
        return;
      }

      const taskTypeEmoji = taskType === "channel" ? "📢" : "🤖";
      const message =
        `${taskTypeEmoji} <b>Новое задание!</b>\n\n` +
        `${taskTitle}\n` +
        `Награда: ${reward} ⭐️\n\n` +
        `Откройте Mini App чтобы выполнить задание!`;

      // Send notifications to all users
      let successCount = 0;
      let failCount = 0;

      for (const user of users) {
        try {
          await this.notifyUser(user.telegram_id, message);
          successCount++;
          // Add small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (error) {
          failCount++;
          logger.error(`Failed to notify user ${user.telegram_id}:`, error);
        }
      }

      logger.info(
        `New task notification complete: ${successCount} sent, ${failCount} failed`
      );
    } catch (error) {
      logger.error("Error in notifyNewTask:", error);
    }
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
  ): Promise<void> {
    try {
      const message =
        `🎉 <b>Ваш реферал выполнил задание!</b>\n\n` +
        `Пользователь: ${referralName}\n` +
        `Задание: ${taskTitle}\n` +
        `Ваш заработок: ${earnings} ⭐️`;

      await this.notifyUser(userId, message);
      logger.info(
        `Referral completion notification sent to user ${userId}, earnings: ${earnings}`
      );
    } catch (error) {
      logger.error(
        `Error sending referral completion notification to user ${userId}:`,
        error
      );
    }
  }

  /**
   * Notify user about withdrawal approval
   * Requirement 14.3: WHEN Withdrawal Request is approved, THE Bot Backend SHALL send notification to User
   */
  static async notifyWithdrawalApproved(
    userId: number,
    amount: number
  ): Promise<void> {
    try {
      const message =
        `✅ <b>Ваша заявка на вывод одобрена!</b>\n\n` +
        `Сумма: ${amount} ⭐️\n` +
        `Звезды будут отправлены в ближайшее время.`;

      await this.notifyUser(userId, message);
      logger.info(`Withdrawal approval notification sent to user ${userId}`);
    } catch (error) {
      logger.error(
        `Error sending withdrawal approval notification to user ${userId}:`,
        error
      );
    }
  }

  /**
   * Notify user about withdrawal rejection
   * Requirement 14.4: WHEN Withdrawal Request is rejected, THE Bot Backend SHALL send notification to User with reason
   */
  static async notifyWithdrawalRejected(
    userId: number,
    amount: number,
    reason: string
  ): Promise<void> {
    try {
      const message =
        `❌ <b>Ваша заявка на вывод отклонена</b>\n\n` +
        `Сумма: ${amount} ⭐️\n` +
        `Причина: ${reason}`;

      await this.notifyUser(userId, message);
      logger.info(`Withdrawal rejection notification sent to user ${userId}`);
    } catch (error) {
      logger.error(
        `Error sending withdrawal rejection notification to user ${userId}:`,
        error
      );
    }
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
  ): Promise<void> {
    try {
      const adminId = parseInt(process.env.ADMIN_TELEGRAM_ID || "0");

      if (!adminId) {
        logger.error("Admin Telegram ID not configured");
        return;
      }

      const message =
        `🔔 <b>Новая заявка на вывод</b>\n\n` +
        `Пользователь: @${username}\n` +
        `ID: ${userId}\n` +
        `Сумма: ${amount} ⭐️\n` +
        `Заявка #${withdrawalId}`;

      await this.notifyUser(adminId, message);
      logger.info(
        `Admin withdrawal request notification sent for withdrawal #${withdrawalId}`
      );
    } catch (error) {
      logger.error("Error sending admin withdrawal notification:", error);
    }
  }

  /**
   * Batch send notifications with rate limiting
   */
  static async batchNotify(
    userIds: number[],
    message: string,
    delayMs: number = 50
  ): Promise<{ success: number; failed: number }> {
    let successCount = 0;
    let failCount = 0;

    for (const userId of userIds) {
      try {
        await this.notifyUser(userId, message);
        successCount++;
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        failCount++;
      }
    }

    return { success: successCount, failed: failCount };
  }
}
