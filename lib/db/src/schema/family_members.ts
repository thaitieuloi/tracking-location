import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { familiesTable } from "./families";
import { profilesTable } from "./profiles";

export const familyMembersTable = pgTable("family_members", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  family_id: text("family_id").notNull().references(() => familiesTable.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull().references(() => profilesTable.user_id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  joined_at: timestamp("joined_at").defaultNow().notNull(),
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembersTable).omit({ id: true, joined_at: true });
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type FamilyMember = typeof familyMembersTable.$inferSelect;
