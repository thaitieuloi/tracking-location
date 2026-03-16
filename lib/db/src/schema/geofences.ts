import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { familiesTable } from "./families";
import { profilesTable } from "./profiles";

export const geofencesTable = pgTable("geofences", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  family_id: text("family_id").notNull().references(() => familiesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  radius: real("radius").notNull(),
  created_by: text("created_by").notNull().references(() => profilesTable.user_id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertGeofenceSchema = createInsertSchema(geofencesTable).omit({ id: true, created_at: true });
export type InsertGeofence = z.infer<typeof insertGeofenceSchema>;
export type Geofence = typeof geofencesTable.$inferSelect;
