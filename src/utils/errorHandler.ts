import express from "express";

export interface CustomError {
  type: string;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

export const handleError = (
  error: unknown,
  res: express.Response,
): express.Response => {
  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    (error as CustomError).type === "validation"
  ) {
    return res.status(400).json(error);
  }

  return res.status(500).json({ error: "Internal server error" });
};
