import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  password: varchar("password", { length: 64 }).notNull(),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  refreshToken: varchar({ length: 255 }).notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
