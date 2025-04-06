import { ADMIN_PERMISSION } from "@/constants/permissionsAndRoles";
import { getPermissions, verifySession } from "@/lib/authFunctions";
import { Request, Response, NextFunction } from "express";

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies.access_token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const tokenData = await verifySession(cookies.access_token);
    if (tokenData.success === false) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const permissions = await getPermissions(tokenData.data.id);
    if (permissions.includes(permission)) {
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  };
};
export const checkPermissionAndOwnership = (permission: string, id: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { access_token } = req.cookies;

      if (!access_token) {
        return res.status(401).json({
          success: false,
          message: "No access token provided",
        });
      }

      const tokenData = await verifySession(access_token);
      if (!tokenData.success) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      const permissions = await getPermissions(tokenData.data.id);
      const isAdmin = permissions.includes(ADMIN_PERMISSION);
      const hasPermission = permissions.includes(permission);
      const isOwner = tokenData.data.id === id;

      if (isAdmin || (hasPermission && isOwner)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};
