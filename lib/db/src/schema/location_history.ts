import { pgTable, text, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profilesTable } from "./profiles";

export const locationHistoryTable = pgTable("location_history", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id").notNull().references(() => profilesTable.user_id, { onDelete: "cascade" }),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  speed: real("speed"),
  is_moving: boolean("is_moving"),
  recorded_at: timestamp("recorded_at").defaultNow().notNull(),
});

export const insertLocationHistorySchema = createInsertSchema(locationHistoryTable).omit({ id: true, recorded_at: true });
export type InsertLocationHistory = z.infer<typeof insertLocationHistorySchema>;
export type LocationHistory = typeof locationHistoryTable.$inferSelect;
