import { pgTable, text, timestamp, real, boolean, smallint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profilesTable } from "./profiles";

export const latestLocationsTable = pgTable("latest_locations", {
  user_id: text("user_id").primaryKey().references(() => profilesTable.user_id, { onDelete: "cascade" }),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  accuracy: real("accuracy"),
  speed: real("speed"),
  heading: real("heading"),
  is_moving: boolean("is_moving"),
  battery_level: smallint("battery_level"),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLatestLocationSchema = createInsertSchema(latestLocationsTable).omit({ updated_at: true });
export type InsertLatestLocation = z.infer<typeof insertLatestLocationSchema>;
export type LatestLocation = typeof latestLocationsTable.$inferSelect;
