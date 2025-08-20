import { relations } from "drizzle-orm";

import { subscriptions } from "./subscriptions.js";
import { users } from "./users.js";

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));
