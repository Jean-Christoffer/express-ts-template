import { date, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const categoryEnum = pgEnum("category", ["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "other"]);
export const frequencyEnum = pgEnum("frequency", ["daily", "weekly", "monthly", "yearly"]);
export const statusEnum = pgEnum("status", ["active", "cancelled", "expired"]);

export const subscriptions = pgTable("subscriptions", {
  category: categoryEnum("category").default("other").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  currency: text("currency").default("NOK").notNull(),
  frequency: frequencyEnum("frequency").default("monthly"),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  payment: text("payment").notNull(),
  price: integer().notNull(),
  renewalDate: date("renewal_date"),
  startDate: date("start_date").notNull(),
  status: statusEnum("status").default("active"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
