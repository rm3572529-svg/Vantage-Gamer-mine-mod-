import { Router, type IRouter } from "express";
import { db, announcementsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { ListAnnouncementsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/announcements", async (_req, res): Promise<void> => {
  const announcements = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.pinned), desc(announcementsTable.createdAt))
    .limit(20);
  res.json(ListAnnouncementsResponse.parse(announcements));
});

export default router;
