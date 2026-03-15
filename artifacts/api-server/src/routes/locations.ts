import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { latestLocationsTable, locationHistoryTable } from "@workspace/db/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import { UpdateLocationBody } from "@workspace/api-zod";

const router: IRouter = Router();

function s<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

router.post("/locations/update", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const body = UpdateLocationBody.parse(req.body);

  const [location] = await db
    .insert(latestLocationsTable)
    .values({
      user_id: userId,
      latitude: body.latitude,
      longitude: body.longitude,
      accuracy: body.accuracy ?? null,
      speed: body.speed ?? null,
      heading: body.heading ?? null,
      is_moving: body.is_moving ?? null,
      battery_level: body.battery_level ?? null,
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: latestLocationsTable.user_id,
      set: {
        latitude: body.latitude,
        longitude: body.longitude,
        accuracy: body.accuracy ?? null,
        speed: body.speed ?? null,
        heading: body.heading ?? null,
        is_moving: body.is_moving ?? null,
        battery_level: body.battery_level ?? null,
        updated_at: new Date(),
      },
    })
    .returning();

  await db.insert(locationHistoryTable).values({
    user_id: userId,
    latitude: body.latitude,
    longitude: body.longitude,
    speed: body.speed ?? null,
    is_moving: body.is_moving ?? null,
  });

  res.json(s(location));
});

router.get("/locations/:userId/latest", async (req, res) => {
  const { userId } = req.params;

  const [location] = await db
    .select()
    .from(latestLocationsTable)
    .where(eq(latestLocationsTable.user_id, userId));

  if (!location) { res.status(404).json({ error: "No location found" }); return; }

  res.json(s(location));
});

router.get("/locations/:userId/history", async (req, res) => {
  const { userId } = req.params;
  const hours = Number(req.query.hours) || 3;

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const history = await db
    .select()
    .from(locationHistoryTable)
    .where(
      and(
        eq(locationHistoryTable.user_id, userId),
        gte(locationHistoryTable.recorded_at, since)
      )
    )
    .orderBy(desc(locationHistoryTable.recorded_at))
    .limit(500);

  res.json(s(history));
});

export default router;
