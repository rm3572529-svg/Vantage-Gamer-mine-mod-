import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const followsTable = pgTable("follows", {
  id: text("id").primaryKey(),
  followerId: text("follower_id").notNull(),
  developerId: text("developer_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [unique().on(t.followerId, t.developerId)]);

export const insertFollowSchema = createInsertSchema(followsTable).omit({ createdAt: true });
export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Follow = typeof followsTable.$inferSelect;
