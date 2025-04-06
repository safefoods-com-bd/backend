import { checkPermissionAndOwnership } from "@/lib/checkPermissionFunctions";
import { Request, Response, NextFunction } from "express";

export const checkPermissionAndOwnershipMiddleware = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id) || parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }

      return await checkPermissionAndOwnership(permission, userId)(
        req,
        res,
        next,
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};
