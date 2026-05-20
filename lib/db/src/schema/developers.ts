import { pgTable, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const developerStatusEnum = pgEnum("developer_status", ["pending", "approved", "rejected", "banned"]);

export const developersTable = pgTable("developers", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  youtubeChannelName: text("youtube_channel_name"),
  youtubeLink: text("youtube_link"),
  instagram: text("instagram"),
  telegram: text("telegram"),
  about: text("about"),
  avatar: text("avatar"),
  status: developerStatusEnum("status").notNull().default("pending"),
  badges: text("badges").array().notNull().default([]),
  followersCount: integer("followers_count").notNull().default(0),
  uploadsCount: integer("uploads_count").notNull().default(0),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDeveloperSchema = createInsertSchema(developersTable).omit({ createdAt: true, followersCount: true, uploadsCount: true, likesCount: true });
export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;
export type Developer = typeof developersTable.$inferSelect;
