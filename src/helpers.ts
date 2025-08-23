import { compare } from "bcrypt-ts";
import { eq } from "drizzle-orm";

import db from "./lib/db/index.js";
import { refreshTokens } from "./lib/db/schemas/users.js";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500, options?: { cause?: unknown }) {
    super(message, options);
    this.statusCode = statusCode;
  }
}

export async function deleteRefreshToken(tokenValue: string) {
  try {
    await db.transaction(async (tx) => {
      const foundTokens = await tx.select({ refreshToken: refreshTokens.refreshToken }).from(refreshTokens);

      let tokenToDelete;

      for (const dbToken of foundTokens) {
        const matches = await compare(tokenValue, dbToken.refreshToken);
        if (matches) {
          tokenToDelete = dbToken.refreshToken;
        }
      }

      if (tokenToDelete) {
        await tx.delete(refreshTokens).where(eq(refreshTokens.refreshToken, tokenToDelete));
      }
    });
  } catch (err) {
    console.error(err);
  }
}
