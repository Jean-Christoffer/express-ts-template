import type { NextFunction, Request, Response } from "express";

import { AppError } from "#helpers.js";
import db from "#lib/db/index.js";
import { users } from "#lib/db/schemas/users.js";
import { eq } from "drizzle-orm";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db
      .select({ email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, Number(req.params.id)));

    const user = result[0];

    if (!user) {
      next(new AppError("user not found.", 404));
      return;
    }
  } catch (e) {
    next(new AppError("A error occurred.", 500, { cause: e }));
  }
};
