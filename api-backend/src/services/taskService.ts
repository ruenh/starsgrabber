import { supabase } from "../config/supabase.js";
import { Task, UserTask } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Get all active tasks
 * @returns Array of active tasks
 */
export async function getActiveTasks(): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error("Error getting active tasks", { error });
    throw error;
  }
}

/**
 * Get task by ID
 * @param taskId - Task ID
 * @returns Task object or null
 */
export async function getTaskById(taskId: number): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    logger.error("Error getting task by ID", { taskId, error });
    throw error;
  }
}

/**
 * Get completed task IDs for a user
 * @param userId - User ID
 * @returns Array of completed task IDs
 */
export async function getUserCompletedTaskIds(
  userId: number
): Promise<number[]> {
  try {
    const { data, error } = await supabase
      .from("user_tasks")
      .select("task_id")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return data ? data.map((row) => row.task_id) : [];
  } catch (error) {
    logger.error("Error getting user completed tasks", { userId, error });
    throw error;
  }
}

/**
 * Check if user has completed a specific task
 * @param userId - User ID
 * @param taskId - Task ID
 * @returns True if task is completed
 */
export async function isTaskCompletedByUser(
  userId: number,
  taskId: number
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_tasks")
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
    logger.error("Error checking task completion", { userId, taskId, error });
    throw error;
  }
}

/**
 * Mark task as completed for user
 * @param userId - User ID
 * @param taskId - Task ID
 * @returns Created user_task record
 */
export async function markTaskCompleted(
  userId: number,
  taskId: number
): Promise<UserTask> {
  try {
    const { data, error } = await supabase
      .from("user_tasks")
      .insert({
        user_id: userId,
        task_id: taskId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("Task marked as completed", { userId, taskId });
    return data;
  } catch (error) {
    logger.error("Error marking task as completed", { userId, taskId, error });
    throw error;
  }
}

/**
 * Get tasks with completion status for a user
 * @param userId - User ID
 * @returns Array of tasks with completed flag
 */
export async function getTasksWithCompletionStatus(
  userId: number
): Promise<(Task & { completed: boolean })[]> {
  try {
    const tasks = await getActiveTasks();
    const completedTaskIds = await getUserCompletedTaskIds(userId);

    return tasks.map((task) => ({
      ...task,
      completed: completedTaskIds.includes(task.id),
    }));
  } catch (error) {
    logger.error("Error getting tasks with completion status", {
      userId,
      error,
    });
    throw error;
  }
}
