import { relations } from "drizzle-orm";

import { subscriptions } from "./subscriptions.js";
import { refreshTokens, users } from "./users.js";

export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}));
