import type { NextFunction, Request, Response } from "express";

import { AppError } from "#helpers.js";
import db from "#lib/db/index.js";
import { users } from "#lib/db/schemas/users.js";
import { eq } from "drizzle-orm";

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await db.select().from(users);

    if (!allUsers.length) {
      next(new AppError("No users found.", 404));
      return;
    }

    res.status(200).json({ data: allUsers, success: true });
  } catch (e) {
    next(new AppError("A error occurred.", 500, { cause: e }));
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db
      .select({ email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, Number(req.params.id)));

    if (!result[0]) {
      next(new AppError("user not found.", 404));
      return;
    }
    const user = result[0];

    res.status(200).json({ data: user, success: true });
  } catch (e) {
    next(new AppError("A error occurred.", 500, { cause: e }));
  }
};
