import { Request, Response } from "express";
/**
 * Get all tasks with completion status for the authenticated user
 * GET /api/tasks
 */
export declare function getTasks(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Verify task completion
 * POST /api/tasks/:id/verify
 */
export declare function verifyTask(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=taskController.d.ts.map