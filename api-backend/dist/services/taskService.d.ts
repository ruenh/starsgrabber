import { Task, UserTask } from "../types/index.js";
/**
 * Get all active tasks
 * @returns Array of active tasks
 */
export declare function getActiveTasks(): Promise<Task[]>;
/**
 * Get task by ID
 * @param taskId - Task ID
 * @returns Task object or null
 */
export declare function getTaskById(taskId: number): Promise<Task | null>;
/**
 * Get completed task IDs for a user
 * @param userId - User ID
 * @returns Array of completed task IDs
 */
export declare function getUserCompletedTaskIds(userId: number): Promise<number[]>;
/**
 * Check if user has completed a specific task
 * @param userId - User ID
 * @param taskId - Task ID
 * @returns True if task is completed
 */
export declare function isTaskCompletedByUser(userId: number, taskId: number): Promise<boolean>;
/**
 * Mark task as completed for user
 * @param userId - User ID
 * @param taskId - Task ID
 * @returns Created user_task record
 */
export declare function markTaskCompleted(userId: number, taskId: number): Promise<UserTask>;
/**
 * Get tasks with completion status for a user
 * @param userId - User ID
 * @returns Array of tasks with completed flag
 */
export declare function getTasksWithCompletionStatus(userId: number): Promise<(Task & {
    completed: boolean;
})[]>;
//# sourceMappingURL=taskService.d.ts.map