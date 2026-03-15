import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  familiesTable,
  familyMembersTable,
  profilesTable,
  latestLocationsTable,
  geofencesTable,
  sosAlertsTable,
} from "@workspace/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import {
  CreateFamilyBody,
  JoinFamilyBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function s<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

router.post("/families", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const body = CreateFamilyBody.parse(req.body);

  const [family] = await db
    .insert(familiesTable)
    .values({
      name: body.name,
      invite_code: generateInviteCode(),
      created_by: userId,
    })
    .returning();

  await db.insert(familyMembersTable).values({
    family_id: family.id,
    user_id: userId,
    role: "admin",
  });

  res.status(201).json(s(family));
});

router.post("/families/join", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const body = JoinFamilyBody.parse(req.body);

  const [family] = await db
    .select()
    .from(familiesTable)
    .where(eq(familiesTable.invite_code, body.invite_code.toUpperCase()));

  if (!family) {
    res.status(404).json({ error: "Invalid invite code" });
    return;
  }

  const existing = await db
    .select()
    .from(familyMembersTable)
    .where(and(eq(familyMembersTable.family_id, family.id), eq(familyMembersTable.user_id, userId)));

  if (existing.length === 0) {
    await db.insert(familyMembersTable).values({
      family_id: family.id,
      user_id: userId,
      role: "member",
    });
  }

  res.json(s(family));
});

router.get("/families/my", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const [membership] = await db
    .select()
    .from(familyMembersTable)
    .where(eq(familyMembersTable.user_id, userId));

  if (!membership) {
    res.status(404).json({ error: "Not in any family" });
    return;
  }

  const [family] = await db.select().from(familiesTable).where(eq(familiesTable.id, membership.family_id));
  if (!family) { res.status(404).json({ error: "Family not found" }); return; }

  const allMembers = await db
    .select()
    .from(familyMembersTable)
    .where(eq(familyMembersTable.family_id, family.id));

  const userIds = allMembers.map((m) => m.user_id);
  const [profiles, locations] = await Promise.all([
    db.select().from(profilesTable).where(inArray(profilesTable.user_id, userIds)),
    db.select().from(latestLocationsTable).where(inArray(latestLocationsTable.user_id, userIds)),
  ]);

  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));
  const locationMap = new Map(locations.map((l) => [l.user_id, l]));

  const members = allMembers
    .filter((m) => profileMap.has(m.user_id))
    .map((m) => ({
      user_id: m.user_id,
      role: m.role,
      profile: profileMap.get(m.user_id)!,
      location: locationMap.get(m.user_id) ?? null,
    }));

  res.json(s({ family, members }));
});

router.get("/families/:familyId/members", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { familyId } = req.params;

  const allMembers = await db
    .select()
    .from(familyMembersTable)
    .where(eq(familyMembersTable.family_id, familyId));

  const userIds = allMembers.map((m) => m.user_id);
  if (userIds.length === 0) { res.json([]); return; }

  const [profiles, locations] = await Promise.all([
    db.select().from(profilesTable).where(inArray(profilesTable.user_id, userIds)),
    db.select().from(latestLocationsTable).where(inArray(latestLocationsTable.user_id, userIds)),
  ]);

  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));
  const locationMap = new Map(locations.map((l) => [l.user_id, l]));

  const members = allMembers
    .filter((m) => profileMap.has(m.user_id))
    .map((m) => ({
      user_id: m.user_id,
      role: m.role,
      profile: profileMap.get(m.user_id)!,
      location: locationMap.get(m.user_id) ?? null,
    }));

  res.json(s(members));
});

router.delete("/families/:familyId/members/:userId", async (req, res) => {
  const currentUserId = req.headers["x-user-id"] as string;
  if (!currentUserId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { familyId, userId } = req.params;

  await db
    .delete(familyMembersTable)
    .where(and(eq(familyMembersTable.family_id, familyId), eq(familyMembersTable.user_id, userId)));

  res.status(204).send();
});

router.get("/families/:familyId/dashboard", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { familyId } = req.params;

  const [family] = await db.select().from(familiesTable).where(eq(familiesTable.id, familyId));
  if (!family) { res.status(404).json({ error: "Family not found" }); return; }

  const allMembers = await db
    .select()
    .from(familyMembersTable)
    .where(eq(familyMembersTable.family_id, familyId));

  const userIds = allMembers.map((m) => m.user_id);

  const [profiles, locations, geofences, recentAlerts] = await Promise.all([
    userIds.length > 0 ? db.select().from(profilesTable).where(inArray(profilesTable.user_id, userIds)) : Promise.resolve([]),
    userIds.length > 0 ? db.select().from(latestLocationsTable).where(inArray(latestLocationsTable.user_id, userIds)) : Promise.resolve([]),
    db.select().from(geofencesTable).where(eq(geofencesTable.family_id, familyId)),
    db.select().from(sosAlertsTable).where(and(eq(sosAlertsTable.family_id, familyId), eq(sosAlertsTable.is_resolved, false))),
  ]);

  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));
  const locationMap = new Map(locations.map((l) => [l.user_id, l]));

  const members = allMembers
    .filter((m) => profileMap.has(m.user_id))
    .map((m) => ({
      user_id: m.user_id,
      role: m.role,
      profile: profileMap.get(m.user_id)!,
      location: locationMap.get(m.user_id) ?? null,
    }));

  const alertsWithProfile = recentAlerts.map((alert) => ({
    ...alert,
    profile: profileMap.get(alert.user_id) ?? null,
  }));

  res.json(s({
    family,
    members,
    geofences,
    recent_alerts: alertsWithProfile,
  }));
});

export default router;
