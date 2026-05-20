import { Router, type IRouter } from "express";
import { db, platformSettingsTable, DEFAULT_SETTINGS } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/settings", async (_req, res): Promise<void> => {
  const rows = await db.select().from(platformSettingsTable);
  const result: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  res.json(result);
});

router.post("/settings", async (req, res): Promise<void> => {
  const updates = req.body as Record<string, string>;
  if (!updates || typeof updates !== "object") {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  for (const [key, value] of Object.entries(updates)) {
    await db
      .insert(platformSettingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: platformSettingsTable.key, set: { value, updatedAt: new Date() } });
  }

  const rows = await db.select().from(platformSettingsTable);
  const result: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  res.json(result);
});

export default router;
