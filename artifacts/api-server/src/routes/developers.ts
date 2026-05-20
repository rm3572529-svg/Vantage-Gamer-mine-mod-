import { Router, type IRouter } from "express";
import { db, developersTable, followsTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  ApplyDeveloperBody,
  ListDevelopersQueryParams,
  GetDeveloperParams,
  ListDevelopersResponse,
  GetDeveloperResponse,
  FollowDeveloperResponse,
} from "@workspace/api-zod";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.get("/developers", async (req, res): Promise<void> => {
  const query = ListDevelopersQueryParams.safeParse(req.query);

  let orderBy = desc(developersTable.createdAt);
  if (query.success) {
    if (query.data.sort === "top") orderBy = desc(developersTable.likesCount);
    else if (query.data.sort === "trending") orderBy = desc(developersTable.followersCount);
    else if (query.data.sort === "featured") orderBy = desc(developersTable.uploadsCount);
  }

  const developers = await db
    .select()
    .from(developersTable)
    .where(eq(developersTable.status, "approved"))
    .orderBy(orderBy)
    .limit(50);

  res.json(ListDevelopersResponse.parse(developers));
});

router.post("/developers", async (req, res): Promise<void> => {
  const parsed = ApplyDeveloperBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = req.body?.userId ?? randomUUID();

  const [developer] = await db
    .insert(developersTable)
    .values({
      id: randomUUID(),
      userId,
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
      youtubeChannelName: parsed.data.youtubeChannelName ?? null,
      youtubeLink: parsed.data.youtubeLink ?? null,
      instagram: parsed.data.instagram ?? null,
      telegram: parsed.data.telegram ?? null,
      about: parsed.data.about ?? null,
      avatar: null,
      status: "pending",
      badges: [],
    })
    .returning();

  res.status(201).json(GetDeveloperResponse.parse(developer));
});

router.get("/developers/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [developer] = await db
    .select()
    .from(developersTable)
    .where(eq(developersTable.id, rawId));

  if (!developer) {
    res.status(404).json({ error: "Developer not found" });
    return;
  }

  res.json(GetDeveloperResponse.parse(developer));
});

router.post("/developers/:id/follow", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const followerId = req.body?.userId ?? "anonymous";

  const [existing] = await db
    .select()
    .from(followsTable)
    .where(and(eq(followsTable.developerId, rawId), eq(followsTable.followerId, followerId)));

  if (existing) {
    await db.delete(followsTable).where(eq(followsTable.id, existing.id));
    await db
      .update(developersTable)
      .set({ followersCount: sql`followers_count - 1` })
      .where(eq(developersTable.id, rawId));
    const [dev] = await db.select().from(developersTable).where(eq(developersTable.id, rawId));
    res.json(FollowDeveloperResponse.parse({ following: false, followersCount: dev?.followersCount ?? 0 }));
  } else {
    await db
      .insert(followsTable)
      .values({ id: randomUUID(), followerId, developerId: rawId })
      .onConflictDoNothing();
    await db
      .update(developersTable)
      .set({ followersCount: sql`followers_count + 1` })
      .where(eq(developersTable.id, rawId));
    const [dev] = await db.select().from(developersTable).where(eq(developersTable.id, rawId));
    res.json(FollowDeveloperResponse.parse({ following: true, followersCount: dev?.followersCount ?? 0 }));
  }
});

export default router;
