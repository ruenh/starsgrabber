import { supabase } from "../config/supabase.js";
import logger from "../utils/logger.js";

export class BotActivationService {
  /**
   * Record bot activation in database
   * @param userId - User ID
   * @param taskId - Task ID
   * @returns Success status
   */
  static async recordActivation(
    userId: number,
    taskId: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("bot_activations").insert({
        user_id: userId,
        task_id: taskId,
      });

      if (error) {
        // Check if it's a duplicate key error (already activated)
        if (error.code === "23505") {
          logger.info(
            `Bot activation already exists: user ${userId}, task ${taskId}`
          );
          return true;
        }
        throw error;
      }

      logger.info(`Bot activation recorded: user ${userId}, task ${taskId}`);
      return true;
    } catch (error) {
      logger.error("Error recording bot activation:", {
        userId,
        taskId,
        error,
      });
      return false;
    }
  }

  /**
   * Check if bot activation exists
   * @param userId - User ID
   * @param taskId - Task ID
   * @returns True if activation exists
   */
  static async checkActivation(
    userId: number,
    taskId: number
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("bot_activations")
        .select("id")
        .eq("user_id", userId)
        .eq("task_id", taskId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return false;
        }
        throw error;
      }

      return !!data;
    } catch (error) {
      logger.error("Error checking bot activation:", { userId, taskId, error });
      return false;
    }
  }

  /**
   * Generate bot activation link
   * @param botUsername - Bot username
   * @param userId - User ID
   * @param taskId - Task ID
   * @returns Bot activation link
   */
  static generateActivationLink(
    botUsername: string,
    userId: number,
    taskId: number
  ): string {
    const startParam = `task_${taskId}_user_${userId}`;
    return `https://t.me/${botUsername}?start=${startParam}`;
  }
}
