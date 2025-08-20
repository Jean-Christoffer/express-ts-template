import type { NextFunction, Request, Response } from "express";

interface PostgresErrorCause {
  code?: string;
  constraint?: null | string;
}

export const errorHandler = (err: unknown, _req: Request, res: Response, next: NextFunction) => {
  const error = (err instanceof Error ? err : new Error("Server Error")) as Error & {
    cause?: unknown;
    expose?: boolean;
    status?: number;
    statusCode?: number;
  };

  try {
    let status = error.statusCode ?? error.status ?? 500;
    let message = error.message || "Server Error";

    if (error.cause && typeof error.cause === "object") {
      const cause = error.cause as PostgresErrorCause;
      switch (cause.code) {
        case "23502":
          status = 400;
          message = "A required field is missing.";
          break;
        case "23503":
          status = 409;
          message = "Related data is missing.";
          break;
        case "23505":
          status = 409;
          message = cause.constraint?.includes("users_userName_unique") ? "Username is already taken." : "A unique field already exists.";
          break;
        case "23514":
          status = 400;
          message = "Invalid data input.";
          break;
        default:
          status = status || 500;
          message = "A database error occurred.";
          break;
      }
    }

    if (res.headersSent) {
      next(error);
      return;
    }

    res.status(status).json({ error: message, success: false });
  } catch (handlerError) {
    next(handlerError);
  }
};
