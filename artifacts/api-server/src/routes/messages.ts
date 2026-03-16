import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { messagesTable, familyMembersTable, profilesTable } from "@workspace/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { SendMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

function s<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

async function getUserFamilyId(userId: string): Promise<string | null> {
  const [membership] = await db.select().from(familyMembersTable).where(eq(familyMembersTable.user_id, userId));
  return membership?.family_id ?? null;
}

router.get("/messages", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const familyId = await getUserFamilyId(userId);
  if (!familyId) { res.status(404).json({ error: "Not in any family" }); return; }

  const limit = Number(req.query.limit) || 50;

  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.family_id, familyId))
    .orderBy(desc(messagesTable.created_at))
    .limit(limit);

  const userIds = [...new Set(msgs.map((m) => m.user_id))];
  const profiles = userIds.length > 0
    ? await db.select().from(profilesTable).where(inArray(profilesTable.user_id, userIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));

  const messagesWithProfiles = msgs.map((m) => ({
    ...m,
    profile: profileMap.get(m.user_id) ?? null,
  }));

  res.json(s(messagesWithProfiles));
});

router.post("/messages", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const familyId = await getUserFamilyId(userId);
  if (!familyId) { res.status(404).json({ error: "Not in any family" }); return; }

  const body = SendMessageBody.parse(req.body);

  const [msg] = await db
    .insert(messagesTable)
    .values({
      family_id: familyId,
      user_id: userId,
      content: body.content,
      message_type: body.message_type ?? "text",
      image_url: body.image_url ?? null,
      location_lat: body.location_lat ?? null,
      location_lng: body.location_lng ?? null,
    })
    .returning();

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.user_id, userId));

  res.status(201).json(s({ ...msg, profile: profile ?? null }));
});

export default router;
