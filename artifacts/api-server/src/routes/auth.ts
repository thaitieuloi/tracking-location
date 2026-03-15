import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { profilesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { UpdateMyProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

function s<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

router.get("/auth/profile", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized - no user id" });
    return;
  }

  let [profile] = await db.select().from(profilesTable).where(eq(profilesTable.user_id, userId));

  if (!profile) {
    [profile] = await db.insert(profilesTable).values({ user_id: userId }).returning();
  }

  res.json(s(profile));
});

router.put("/auth/profile", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = UpdateMyProfileBody.parse(req.body);

  const [profile] = await db
    .update(profilesTable)
    .set({ ...body, updated_at: new Date() })
    .where(eq(profilesTable.user_id, userId))
    .returning();

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(s(profile));
});

export default router;
