import { Router, type IRouter } from "express";
import { db, modsTable, likesTable, commentsTable, downloadsTable } from "@workspace/db";
import { eq, desc, ilike, and, sql, or } from "drizzle-orm";
import {
  CreateModBody,
  ListModsQueryParams,
  GetModParams,
  LikeModParams,
  GetModCommentsParams,
  CreateModCommentParams,
  CreateModCommentBody,
  GetModResponse,
  ListModsResponse,
  GetTrendingModsResponse,
  GetFeaturedModsResponse,
  GetModCommentsResponse,
  LikeModResponse,
  TrackDownloadBody,
  TrackDownloadResponse,
} from "@workspace/api-zod";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.get("/mods", async (req, res): Promise<void> => {
  const query = ListModsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { category, search, sort, limit = 20, offset = 0 } = query.data;

  const conditions = [eq(modsTable.status, "approved")];
  if (category) conditions.push(eq(modsTable.category, category as any));
  if (search) {
    conditions.push(
      or(
        ilike(modsTable.title, `%${search}%`),
        ilike(modsTable.description, `%${search}%`)
      )!
    );
  }

  let orderBy = desc(modsTable.createdAt);
  if (sort === "trending") orderBy = desc(modsTable.downloadCount);
  else if (sort === "top") orderBy = desc(modsTable.likeCount);

  const mods = await db
    .select()
    .from(modsTable)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const [total] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(modsTable)
    .where(and(...conditions));

  res.json(ListModsResponse.parse({ mods, total: total?.count ?? 0 }));
});

router.post("/mods", async (req, res): Promise<void> => {
  const parsed = CreateModBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const mod = {
    id: randomUUID(),
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category as any,
    status: "pending" as const,
    developerId: (req.body as any).developerId ?? "unknown",
    developerName: (req.body as any).developerName ?? "Unknown Developer",
    developerAvatar: (req.body as any).developerAvatar ?? null,
    version: parsed.data.version,
    changelog: parsed.data.changelog ?? null,
    bannerImage: parsed.data.bannerImage ?? null,
    screenshots: parsed.data.screenshots ?? [],
    setupVideo: parsed.data.setupVideo ?? null,
    gameplayVideo: parsed.data.gameplayVideo ?? null,
    downloadLink: parsed.data.downloadLink,
    installationGuide: parsed.data.installationGuide ?? null,
    tags: parsed.data.tags ?? [],
    downloadCount: 0,
    likeCount: 0,
    featured: false,
    vip: false,
    rejectionReason: null,
  };

  const [created] = await db.insert(modsTable).values(mod).returning();
  res.status(201).json(GetModResponse.parse(created));
});

router.get("/mods/trending", async (_req, res): Promise<void> => {
  const mods = await db
    .select()
    .from(modsTable)
    .where(eq(modsTable.status, "approved"))
    .orderBy(desc(modsTable.downloadCount))
    .limit(10);
  res.json(GetTrendingModsResponse.parse(mods));
});

router.get("/mods/featured", async (_req, res): Promise<void> => {
  const mods = await db
    .select()
    .from(modsTable)
    .where(and(eq(modsTable.status, "approved"), eq(modsTable.featured, true)))
    .orderBy(desc(modsTable.createdAt))
    .limit(10);
  res.json(GetFeaturedModsResponse.parse(mods));
});

router.get("/mods/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [mod] = await db.select().from(modsTable).where(eq(modsTable.id, rawId));
  if (!mod) {
    res.status(404).json({ error: "Mod not found" });
    return;
  }
  res.json(GetModResponse.parse(mod));
});

router.post("/mods/:id/like", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = req.body?.userId ?? "anonymous";

  const [existingLike] = await db
    .select()
    .from(likesTable)
    .where(and(eq(likesTable.modId, rawId), eq(likesTable.userId, userId)));

  if (existingLike) {
    await db.delete(likesTable).where(eq(likesTable.id, existingLike.id));
    await db
      .update(modsTable)
      .set({ likeCount: sql`like_count - 1` })
      .where(eq(modsTable.id, rawId));
    const [mod] = await db.select().from(modsTable).where(eq(modsTable.id, rawId));
    res.json(LikeModResponse.parse({ liked: false, likeCount: mod?.likeCount ?? 0 }));
  } else {
    await db.insert(likesTable).values({ id: randomUUID(), userId, modId: rawId }).onConflictDoNothing();
    await db
      .update(modsTable)
      .set({ likeCount: sql`like_count + 1` })
      .where(eq(modsTable.id, rawId));
    const [mod] = await db.select().from(modsTable).where(eq(modsTable.id, rawId));
    res.json(LikeModResponse.parse({ liked: true, likeCount: mod?.likeCount ?? 0 }));
  }
});

router.get("/mods/:id/comments", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.modId, rawId))
    .orderBy(desc(commentsTable.createdAt));
  res.json(GetModCommentsResponse.parse(comments));
});

router.post("/mods/:id/comments", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = CreateModCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [comment] = await db
    .insert(commentsTable)
    .values({
      id: randomUUID(),
      modId: rawId,
      userId: parsed.data.userId,
      username: parsed.data.username,
      userAvatar: parsed.data.userAvatar ?? null,
      content: parsed.data.content,
    })
    .returning();

  res.status(201).json(comment);
});

router.post("/downloads/track", async (req, res): Promise<void> => {
  const parsed = TrackDownloadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [mod] = await db.select().from(modsTable).where(eq(modsTable.id, parsed.data.modId));
  if (!mod) {
    res.status(404).json({ error: "Mod not found" });
    return;
  }

  await db.insert(downloadsTable).values({
    id: randomUUID(),
    modId: parsed.data.modId,
    userId: parsed.data.userId ?? null,
    ip: req.ip ?? null,
  });

  await db
    .update(modsTable)
    .set({ downloadCount: sql`download_count + 1` })
    .where(eq(modsTable.id, parsed.data.modId));

  const [updated] = await db.select().from(modsTable).where(eq(modsTable.id, parsed.data.modId));

  res.json(TrackDownloadResponse.parse({
    downloadUrl: mod.downloadLink,
    downloadCount: updated?.downloadCount ?? mod.downloadCount + 1,
  }));
});

export default router;
