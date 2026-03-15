import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sosAlertsTable, familyMembersTable, profilesTable } from "@workspace/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { SendSOSBody } from "@workspace/api-zod";

const router: IRouter = Router();

function s<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

async function getUserFamilyId(userId: string): Promise<string | null> {
  const [membership] = await db.select().from(familyMembersTable).where(eq(familyMembersTable.user_id, userId));
  return membership?.family_id ?? null;
}

router.post("/sos/send", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const familyId = await getUserFamilyId(userId);
  if (!familyId) { res.status(404).json({ error: "Not in any family" }); return; }

  const body = SendSOSBody.parse(req.body);

  const [alert] = await db
    .insert(sosAlertsTable)
    .values({
      family_id: familyId,
      user_id: userId,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      message: body.message ?? null,
      is_resolved: false,
    })
    .returning();

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.user_id, userId));

  res.json(s({ ...alert, profile: profile ?? null }));
});

router.get("/sos/alerts", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const familyId = await getUserFamilyId(userId);
  if (!familyId) { res.status(404).json({ error: "Not in any family" }); return; }

  const alerts = await db
    .select()
    .from(sosAlertsTable)
    .where(eq(sosAlertsTable.family_id, familyId))
    .orderBy(desc(sosAlertsTable.created_at))
    .limit(20);

  const userIds = [...new Set(alerts.map((a) => a.user_id))];
  const profiles = userIds.length > 0
    ? await db.select().from(profilesTable).where(inArray(profilesTable.user_id, userIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));

  const alertsWithProfiles = alerts.map((a) => ({
    ...a,
    profile: profileMap.get(a.user_id) ?? null,
  }));

  res.json(s(alertsWithProfiles));
});

export default router;
