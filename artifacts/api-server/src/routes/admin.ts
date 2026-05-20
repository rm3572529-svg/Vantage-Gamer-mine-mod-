import { Router, type IRouter } from "express";
import { db, modsTable, developersTable, usersTable, announcementsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import {
  AdminLoginBody,
  AdminLoginResponse,
  AdminListModsQueryParams,
  AdminListModsResponse,
  AdminListDevelopersQueryParams,
  AdminListDevelopersResponse,
  AdminListUsersResponse,
  AdminApproveModParams,
  AdminRejectModParams,
  AdminRejectModBody,
  AdminApproveModResponse,
  AdminRejectModResponse,
  AdminApproveDeveloperParams,
  AdminBanDeveloperParams,
  AdminApproveDeveloperResponse,
  AdminBanDeveloperResponse,
  CreateAnnouncementBody,
  AdminGetStatsResponse,
} from "@workspace/api-zod";
import { randomUUID } from "crypto";

const ADMIN_PASSWORD = "741222";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  res.json(AdminLoginResponse.parse({ token, expiresAt }));
});

router.get("/admin/mods", async (req, res): Promise<void> => {
  const query = AdminListModsQueryParams.safeParse(req.query);
  const status = query.success ? query.data.status : undefined;

  const conditions = status ? [eq(modsTable.status, status as any)] : [];

  const mods = await db
    .select()
    .from(modsTable)
    .where(conditions.length ? conditions[0] : undefined)
    .orderBy(desc(modsTable.createdAt));

  const [total] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(modsTable)
    .where(conditions.length ? conditions[0] : undefined);

  res.json(AdminListModsResponse.parse({ mods, total: total?.count ?? 0 }));
});

router.post("/admin/mods/:id/approve", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [mod] = await db
    .update(modsTable)
    .set({ status: "approved", updatedAt: new Date() })
    .where(eq(modsTable.id, rawId))
    .returning();

  if (!mod) {
    res.status(404).json({ error: "Mod not found" });
    return;
  }

  res.json(AdminApproveModResponse.parse(mod));
});

router.post("/admin/mods/:id/reject", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = AdminRejectModBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [mod] = await db
    .update(modsTable)
    .set({ status: "rejected", rejectionReason: parsed.data.reason, updatedAt: new Date() })
    .where(eq(modsTable.id, rawId))
    .returning();

  if (!mod) {
    res.status(404).json({ error: "Mod not found" });
    return;
  }

  res.json(AdminRejectModResponse.parse(mod));
});

router.get("/admin/developers", async (req, res): Promise<void> => {
  const query = AdminListDevelopersQueryParams.safeParse(req.query);
  const status = query.success ? query.data.status : undefined;

  const developers = status
    ? await db.select().from(developersTable).where(eq(developersTable.status, status as any)).orderBy(desc(developersTable.createdAt))
    : await db.select().from(developersTable).orderBy(desc(developersTable.createdAt));

  res.json(AdminListDevelopersResponse.parse(developers));
});

router.post("/admin/developers/:id/approve", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [developer] = await db
    .update(developersTable)
    .set({ status: "approved" })
    .where(eq(developersTable.id, rawId))
    .returning();

  if (!developer) {
    res.status(404).json({ error: "Developer not found" });
    return;
  }

  res.json(AdminApproveDeveloperResponse.parse(developer));
});

router.post("/admin/developers/:id/ban", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [developer] = await db
    .update(developersTable)
    .set({ status: "banned" })
    .where(eq(developersTable.id, rawId))
    .returning();

  if (!developer) {
    res.status(404).json({ error: "Developer not found" });
    return;
  }

  res.json(AdminBanDeveloperResponse.parse(developer));
});

router.get("/admin/users", async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(AdminListUsersResponse.parse(users));
});

router.post("/admin/announcements", async (req, res): Promise<void> => {
  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [announcement] = await db
    .insert(announcementsTable)
    .values({
      id: randomUUID(),
      title: parsed.data.title,
      content: parsed.data.content,
      type: parsed.data.type as any,
      pinned: parsed.data.pinned ?? false,
    })
    .returning();

  res.status(201).json(announcement);
});

router.post("/admin/mods/:id/featured", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const featured = req.body?.featured === true || req.body?.featured === "true";
  const [mod] = await db
    .update(modsTable)
    .set({ featured, updatedAt: new Date() })
    .where(eq(modsTable.id, rawId))
    .returning();
  if (!mod) { res.status(404).json({ error: "Mod not found" }); return; }
  res.json(mod);
});

router.post("/admin/mods/:id/vip", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const vip = req.body?.vip === true || req.body?.vip === "true";
  const [mod] = await db
    .update(modsTable)
    .set({ vip, updatedAt: new Date() })
    .where(eq(modsTable.id, rawId))
    .returning();
  if (!mod) { res.status(404).json({ error: "Mod not found" }); return; }
  res.json(mod);
});

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [[totalMods], [pendingMods], [totalDevelopers], [pendingDevelopers], [totalUsers], [bannedUsers], [totalDownloadsAgg]] =
    await Promise.all([
      db.select({ count: sql<number>`cast(count(*) as int)` }).from(modsTable),
      db.select({ count: sql<number>`cast(count(*) as int)` }).from(modsTable).where(eq(modsTable.status, "pending")),
      db.select({ count: sql<number>`cast(count(*) as int)` }).from(developersTable),
      db.select({ count: sql<number>`cast(count(*) as int)` }).from(developersTable).where(eq(developersTable.status, "pending")),
      db.select({ count: sql<number>`cast(count(*) as int)` }).from(usersTable),
      db.select({ count: sql<number>`cast(count(*) as int)` }).from(usersTable).where(eq(usersTable.status, "banned")),
      db.select({ count: sql<number>`cast(coalesce(sum(download_count), 0) as int)` }).from(modsTable),
    ]);

  res.json(
    AdminGetStatsResponse.parse({
      totalMods: totalMods?.count ?? 0,
      totalDownloads: totalDownloadsAgg?.count ?? 0,
      totalDevelopers: totalDevelopers?.count ?? 0,
      totalUsers: totalUsers?.count ?? 0,
      pendingMods: pendingMods?.count ?? 0,
      pendingDevelopers: pendingDevelopers?.count ?? 0,
      bannedUsers: bannedUsers?.count ?? 0,
    })
  );
});

export default router;
