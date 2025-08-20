import type { NextFunction, Request, Response } from "express";
import type { Secret, SignOptions } from "jsonwebtoken";

import { env } from "#lib/config.js";
import { refreshTokens, users } from "#lib/db/schemas/users.js";
import { userSchema, userSignInSchema } from "#lib/zod/userSchema.js";
import { compare, genSalt, hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { AppError } from "../helpers.js";
import db from "../lib/db/index.js";

type SignInUser = z.infer<typeof userSignInSchema>;
type User = z.infer<typeof userSchema>;

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password } = req.body as User;

    const result = userSchema.safeParse({ email, name, password });

    if (!result.success) {
      const readableError = z.prettifyError(result.error);

      next(new AppError(readableError, 409));
      return;
    }

    const userData = result.data;

    const userResult = await db.select({ id: users.id }).from(users).where(eq(users.email, userData.email));

    if (userResult.length) {
      next(new AppError("User already exists", 409));
      return;
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(userData.password, salt);

    const [newUser] = await db.insert(users).values({ email: userData.email, name: userData.name, password: hashedPassword }).returning();

    const secret: Secret = env.JWT_SECRET;

    const payload: Record<string, number | string> = {
      userId: newUser.id,
      username: newUser.name,
    };

    const accessOpts: SignOptions = { expiresIn: 24 * 60 * 60 };

    const accessToken = jwt.sign(payload, secret, accessOpts);

    res.status(201).json({
      data: {
        accessToken,
      },
      message: "User created",
      success: true,
    });
  } catch (e) {
    next(new AppError("A error occurred.", 500, { cause: e }));
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as SignInUser;

    const result = userSignInSchema.safeParse({ email, password });

    if (!result.success) {
      const readableError = z.prettifyError(result.error);

      next(new AppError(readableError, 409));
      return;
    }

    const userData = result.data;

    const userResult = await db.select().from(users).where(eq(users.email, userData.email));

    if (!userResult[0]) {
      next(new AppError("User not found", 404));
      return;
    }
    const user = userResult[0];

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      next(new AppError("Incorrect Password", 401));
      return;
    }

    const secret: Secret = env.JWT_SECRET;

    const payload: Record<string, number | string> = {
      userId: user.id,
      username: user.name,
    };

    const salt = await genSalt(10);
    const accessOpts: SignOptions = { expiresIn: 24 * 60 * 60 };
    const refreshOpts: SignOptions = { expiresIn: env.JWT_EXPIRES_IN };

    const accessToken = jwt.sign(payload, secret, accessOpts);
    const refreshToken = jwt.sign(payload, secret, refreshOpts);

    const hashedToken = await hash(refreshToken, salt);

    await db.insert(refreshTokens).values({ refreshToken: hashedToken, userId: user.id });

    const filteredUserData = {
      email: user.email,
      name: user.name,
    };

    res.status(200).json({
      data: {
        accessToken,
        refreshToken,
        ...filteredUserData,
      },
      message: "Logged in successfully",
      success: true,
    });
  } catch (e) {
    next(new AppError("A error occurred.", 500, { cause: e }));
  }
};

export const signOut = (_req: Request, res: Response) => {
  res.send("asd");
};
