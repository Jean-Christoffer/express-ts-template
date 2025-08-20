import type { NextFunction, Request, Response } from "express";

interface PostgresErrorCause {
  code?: string;
  constraint?: null | string;
}

export const errorHandler = (err: unknown, _req: Request, res: Response, next: NextFunction) => {
  try {
    const error = (err instanceof Error ? err : new Error("Server Error")) as Error & {
      cause?: unknown;
      statusCode?: number;
    };

    let status = error.statusCode ?? 500;
    let message = error.message || "Server Error";

    if (error.cause && typeof error.cause === "object") {
      const cause = error.cause as PostgresErrorCause;
      switch (cause.code) {
        case "23502":
          message = "A required field is missing.";
          status = 400;
          break;
        case "23503":
          message = "Related data is missing.";
          status = 409;
          break;
        case "23505":
          message = cause.constraint?.includes("users_userName_unique") ? "Username is already taken." : "A unique field already exists.";
          status = 409;
          break;
        case "23514":
          message = "Invalid data input.";
          status = 400;
          break;
        default:
          message = "A database error occurred.";
          status = 500;
          break;
      }
    }

    if (res.headersSent) {
      next(error);
      return;
    }
    return res.status(status).json({ error: message, success: false });
  } catch (handlerError) {
    next(handlerError);
    return;
  }
};
