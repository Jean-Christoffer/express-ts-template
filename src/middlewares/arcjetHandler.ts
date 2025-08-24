import type { NextFunction, Request, Response } from "express";

import { AppError } from "#helpers.js";
import { aj } from "#lib/config.js";

const arcjetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ message: "Rate limit exceeded" });
      }
      if (decision.reason.isBot()) {
        res.status(403).json({ message: "Bot detected" });
      }
      res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (e) {
    next(new AppError("Arcjet Middleware Error", 500, { cause: e }));
  }
};

export default arcjetHandler;
