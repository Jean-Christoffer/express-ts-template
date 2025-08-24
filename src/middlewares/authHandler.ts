import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { env } from "#lib/config.js";
import db from "#lib/db/index.js";
import { refreshTokens, users } from "#lib/db/schemas/users.js";
import { compare } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

type TokenPayload = JwtPayload & { userId: number };

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = req.cookies as {
      accessToken?: string;
      refreshToken?: string;
    };

    if (!accessToken && !refreshToken) return res.status(401).json({ message: "Unauthorized" });

    if (accessToken) {
      const payload = jwt.verify(accessToken, env.JWT_SECRET) as TokenPayload;

      const user = await db.select({ email: users.email, id: users.id, name: users.name }).from(users).where(eq(users.id, payload.userId));

      if (!user.length) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.locals.user = user[0];
    }

    if (refreshToken) {
      const payload = jwt.verify(refreshToken, env.JWT_SECRET) as JwtPayload & { exp: number; userId: number; username: string };

      if (typeof payload.userId !== "number" || typeof payload.exp !== "number") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const tokens = await db.select({ refreshToken: refreshTokens.refreshToken }).from(refreshTokens);

      let validToken = false;
      for (const dbToken of tokens) {
        if (await compare(refreshToken, dbToken.refreshToken)) {
          validToken = true;
          break;
        }
      }

      if (!validToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessTtlSeconds = 24 * 60 * 60; // 86400
      const cookieMaxAgeMs = accessTtlSeconds * 1000;

      const newPayload: Record<string, number | string> = {
        userId: payload.userId,
        username: payload.username,
      };

      const newAccessToken = jwt.sign(newPayload, env.JWT_SECRET, { expiresIn: accessTtlSeconds });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: cookieMaxAgeMs,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      const user = await db.select({ email: users.email, id: users.id, name: users.name }).from(users).where(eq(users.id, payload.userId));
      if (!user.length) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.locals.user = user[0];
    }

    next();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(401).json({ error: msg, message: "Unauthorized" });
  }
};
