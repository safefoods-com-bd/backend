// middleware/apiKeyMiddleware.ts
import { Request, Response, NextFunction } from "express";

const API_KEY = process.env.API_KEY; // Store your API key in environment variables

export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "API key is missing",
      });
    }

    if (apiKey !== API_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid API key",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
