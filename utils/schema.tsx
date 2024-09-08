import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const GeminiOutput = pgTable("geminiOutput", {
  id: serial("id").primaryKey(),
  formData: varchar("formData").notNull(),
  aiResponse: text("ai-response"),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"),
});
