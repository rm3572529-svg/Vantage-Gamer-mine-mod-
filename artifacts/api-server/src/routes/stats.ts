import { Router, type IRouter } from "express";
import { db, usersTable, modsTable, developersTable, downloadsTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";
import { GetPlatformStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (req, res): Promise<void> => {
  const [totalMods] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(modsTable)
    .where(eq(modsTable.status, "approved"));

  const [totalDownloads] = await db
    .select({ count: sql<number>`cast(sum(download_count) as int)` })
    .from(modsTable)
    .where(eq(modsTable.status, "approved"));

  const [totalDevelopers] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(developersTable)
    .where(eq(developersTable.status, "approved"));

  const [totalUsers] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(usersTable);

  res.json(
    GetPlatformStatsResponse.parse({
      totalMods: totalMods?.count ?? 0,
      totalDownloads: totalDownloads?.count ?? 0,
      totalDevelopers: totalDevelopers?.count ?? 0,
      totalUsers: totalUsers?.count ?? 0,
    })
  );
});

export default router;
