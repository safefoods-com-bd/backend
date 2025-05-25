import express from "express";
import { logger } from "..";

export interface CustomError {
  type: string;
  message?: string;
  statusCode?: number;
  details?: unknown;
  customMessage?: string;
  code?: string;
}

export const ERROR_TYPES = {
  VALIDATION: "validation",
  DATABASE: "database",
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "not_found",
  BAD_REQUEST: "bad_request",
  INTERNAL_SERVER_ERROR: "internal_server_error",
  FILE_TOO_LARGE: "file_too_large",
  FILE_TYPE_NOT_SUPPORTED: "file_type_not_supported",
};

/**
 * Unified error handler for the app.
 * Handles known error types (validation, database, etc.) and falls back to 500 for unknowns.
 */
export const handleError = (
  error: unknown,
  res: express.Response,
  endpoint?: string,
): express.Response => {
  let statusCode = 500;
  let message = "Internal server error";
  let details = {};

  // First check for specific database connection errors
  if (error instanceof Error) {
    if (error.message.includes("getaddrinfo EAI_AGAIN")) {
      return res.status(503).json({
        success: false,
        message:
          "Database connection failed. Please try again in a few moments.",
        details: {
          code: "DB_CONNECTION_ERROR",
        },
      });
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    typeof (error as CustomError).type === "string"
  ) {
    const err = error as CustomError;

    // Customize based on error types
    switch (err.type) {
      case ERROR_TYPES.VALIDATION:
        statusCode = 400;
        message = err.message || "Validation error";
        details = err.details || {};
        break;
      case ERROR_TYPES.DATABASE:
        statusCode = 503; // Changed to 503 Service Unavailable for database issues
        message = err.message || "Database service is currently unavailable";
        details = {
          code: "DB_ERROR",
          ...((err.details as object) || {}),
        };
        break;
      case ERROR_TYPES.UNAUTHORIZED:
        statusCode = 401;
        message = err.message || "Unauthorized";
        details = err.details || {};
        break;
      case ERROR_TYPES.FORBIDDEN:
        statusCode = 403;
        message = err.message || "Forbidden";

        break;
      case ERROR_TYPES.FILE_TOO_LARGE:
        statusCode = 413;
        message = err.message || "File too large";
        details = {
          code: "FILE_TOO_LARGE",
          ...((err.details as object) || {}),
        };
        break;
      case ERROR_TYPES.FILE_TYPE_NOT_SUPPORTED:
        statusCode = 415;
        message = err.message || "File type not supported";
        details = {
          code: "FILE_TYPE_NOT_SUPPORTED",
          ...((err.details as object) || {}),
        };
        break;
      case ERROR_TYPES.BAD_REQUEST:
        statusCode = 400;
        message = err.message || "Bad request";
        details = err.details || {};
        break;
      default:
        statusCode = err.statusCode ?? 500;
        message = err.message || "Internal server error";
        details = err.details || {};
    }
  } else if (error instanceof Error) {
    message = error.message;
    details = { stack: error.stack };
  }

  logger.error({
    endpoint,
    error,
    message,
    statusCode,
  });

  return res.status(statusCode).json({
    success: false,
    message: message,
    details,
  });
};
