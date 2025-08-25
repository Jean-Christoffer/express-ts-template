import type { NextFunction, Request, Response } from "express";

import { AppError } from "#helpers.js";
import db from "#lib/db/index.js";
import { subscriptions } from "#lib/db/schemas/subscriptions.js";
import { users } from "#lib/db/schemas/users.js";
import { subscriptionSchema } from "#lib/zod/subscriptionSchema.js";
import { z } from "zod";

type Subscription = z.infer<typeof subscriptionSchema>;

type UserLocals = Pick<typeof users.$inferSelect, "email" | "id" | "name">;

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptionBody = req.body as Subscription;

    const result = subscriptionSchema.safeParse(subscriptionBody);

    if (!result.success) {
      const readableError = z.prettifyError(result.error);

      next(new AppError(readableError, 409));
      return;
    }

    const subscriptionData = result.data;
    const user = res.locals.user as UserLocals;
    const id = user.id;

    const { frequency, renewalDate, startDate } = subscriptionData;

    const start = new Date(`${startDate}T00:00:00Z`);

    let renew: Date;
    if (renewalDate) {
      renew = new Date(`${renewalDate}T00:00:00Z`);
    } else {
      renew = new Date(start);
      switch (frequency) {
        case "daily":
          renew.setUTCDate(renew.getUTCDate() + 1);
          break;
        case "monthly":
          renew.setUTCMonth(renew.getUTCMonth() + 1);
          break;
        case "weekly":
          renew.setUTCDate(renew.getUTCDate() + 7);
          break;
        case "yearly":
        default:
          renew.setUTCFullYear(renew.getUTCFullYear() + 1);
          break;
      }
    }

    const renewalDateStr = renew.toISOString().slice(0, 10);

    const subscription = await db
      .insert(subscriptions)
      .values({
        ...subscriptionData,
        renewalDate: renewalDateStr,
        userId: id,
      })
      .returning();

    res.status(201).json({ data: subscription[0], message: "Subscription created" });
  } catch (e) {
    next(new AppError("Server Error", 500, { cause: e }));
  }
};
