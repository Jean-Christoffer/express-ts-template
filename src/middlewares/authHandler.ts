import type { NextFunction, Request, Response } from "express";

import { env } from "#lib/config.js";
import db from "#lib/db/index.js";
import jwt from "jsonwebtoken";

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = req.cookies as {
      accessToken?: string;
      refreshToken?: string;
    };

    if (!accessToken && !refreshToken) return res.status(401).json({ message: "Unauthorized" });

    if (accessToken) {
      const payload = jwt.verify(accessToken, env.JWT_SECRET);
    }
    next();
  } catch (e) {
    if (e instanceof Error) {
      res.status(401).json({ error: e.message, message: "Unauthorized" });
    }
    res.status(401).json({ error: e, message: "Unauthorized" });
  }
};
