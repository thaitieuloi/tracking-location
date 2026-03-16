import { pgTable, text, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { familiesTable } from "./families";
import { profilesTable } from "./profiles";

export const sosAlertsTable = pgTable("sos_alerts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  family_id: text("family_id").notNull().references(() => familiesTable.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull().references(() => profilesTable.user_id, { onDelete: "cascade" }),
  latitude: real("latitude"),
  longitude: real("longitude"),
  message: text("message"),
  is_resolved: boolean("is_resolved").notNull().default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertSosAlertSchema = createInsertSchema(sosAlertsTable).omit({ id: true, created_at: true });
export type InsertSosAlert = z.infer<typeof insertSosAlertSchema>;
export type SosAlert = typeof sosAlertsTable.$inferSelect;
