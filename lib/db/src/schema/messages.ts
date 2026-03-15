import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { familiesTable } from "./families";
import { profilesTable } from "./profiles";

export const messagesTable = pgTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  family_id: text("family_id").notNull().references(() => familiesTable.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull().references(() => profilesTable.user_id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  message_type: text("message_type").notNull().default("text"),
  image_url: text("image_url"),
  location_lat: real("location_lat"),
  location_lng: real("location_lng"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, created_at: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;
