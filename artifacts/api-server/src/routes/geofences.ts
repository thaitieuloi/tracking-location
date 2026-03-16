import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { geofencesTable, familyMembersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { CreateGeofenceBody } from "@workspace/api-zod";

const router: IRouter = Router();

function s<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

async function getUserFamilyId(userId: string): Promise<string | null> {
  const [membership] = await db.select().from(familyMembersTable).where(eq(familyMembersTable.user_id, userId));
  return membership?.family_id ?? null;
}

router.get("/geofences", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const familyId = await getUserFamilyId(userId);
  if (!familyId) { res.status(404).json({ error: "Not in any family" }); return; }

  const geofences = await db.select().from(geofencesTable).where(eq(geofencesTable.family_id, familyId));
  res.json(s(geofences));
});

router.post("/geofences", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const familyId = await getUserFamilyId(userId);
  if (!familyId) { res.status(404).json({ error: "Not in any family" }); return; }

  const body = CreateGeofenceBody.parse(req.body);

  const [geofence] = await db
    .insert(geofencesTable)
    .values({
      family_id: familyId,
      name: body.name,
      latitude: body.latitude,
      longitude: body.longitude,
      radius: body.radius,
      created_by: userId,
    })
    .returning();

  res.status(201).json(s(geofence));
});

router.delete("/geofences/:geofenceId", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  await db.delete(geofencesTable).where(eq(geofencesTable.id, req.params.geofenceId));
  res.status(204).send();
});

export default router;
