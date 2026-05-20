import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const platformSettingsTable = pgTable("platform_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type PlatformSetting = typeof platformSettingsTable.$inferSelect;

export const DEFAULT_SETTINGS: Record<string, string> = {
  whatsapp: "https://wa.me/message/VANTAGE",
  telegram: "https://t.me/vantagearmy",
  discord: "",
  instagram: "",
  youtube1: "",
  youtube2: "",
  maintenance: "false",
  version: "1.0.0",
  apk_link: "",
  announcement_banner: "",
};
