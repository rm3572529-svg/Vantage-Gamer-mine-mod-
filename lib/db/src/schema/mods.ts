import { pgTable, text, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const modCategoryEnum = pgEnum("mod_category", ["mod", "tool", "texture", "shader", "utility"]);
export const modStatusEnum = pgEnum("mod_status", ["pending", "approved", "rejected", "suspended"]);

export const modsTable = pgTable("mods", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: modCategoryEnum("category").notNull(),
  status: modStatusEnum("status").notNull().default("pending"),
  developerId: text("developer_id").notNull(),
  developerName: text("developer_name").notNull(),
  developerAvatar: text("developer_avatar"),
  version: text("version").notNull(),
  changelog: text("changelog"),
  bannerImage: text("banner_image"),
  screenshots: text("screenshots").array().notNull().default([]),
  setupVideo: text("setup_video"),
  gameplayVideo: text("gameplay_video"),
  downloadLink: text("download_link").notNull(),
  installationGuide: text("installation_guide"),
  tags: text("tags").array().notNull().default([]),
  downloadCount: integer("download_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  vip: boolean("vip").notNull().default(false),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertModSchema = createInsertSchema(modsTable).omit({ createdAt: true, updatedAt: true, downloadCount: true, likeCount: true, featured: true, vip: true });
export type InsertMod = z.infer<typeof insertModSchema>;
export type Mod = typeof modsTable.$inferSelect;
