import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  location: text("location").notNull(),
  locationAr: text("location_ar"),
  code: text("code").notNull(),
  basePrice: integer("base_price").notNull(),
});

export const matches = pgTable("matches", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  eventId: integer("event_id").notNull().references(() => events.id),
  matchCode: text("match_code").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  dayOfWeek: text("day_of_week").notNull(),
  stadium: text("stadium").notNull(),
  stadiumAr: text("stadium_ar"),
  basePrice: integer("base_price").notNull(),
  status: text("status").notNull().default("available"),
});

export const seatCategories = pgTable("seat_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  matchId: integer("match_id").notNull().references(() => matches.id),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  available: boolean("available").notNull().default(true),
  colorCode: text("color_code").notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sessionId: text("session_id").notNull(),
  matchId: integer("match_id").notNull().references(() => matches.id),
  categoryId: integer("category_id").notNull().references(() => seatCategories.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEventSchema = z.object({
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
  locationAr: z.string().optional(),
  code: z.string(),
  basePrice: z.number(),
});

export const insertMatchSchema = z.object({
  eventId: z.number(),
  matchCode: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  date: z.string(),
  time: z.string(),
  dayOfWeek: z.string(),
  stadium: z.string(),
  stadiumAr: z.string().optional(),
  basePrice: z.number(),
  status: z.string().default("available"),
});

export const insertSeatCategorySchema = z.object({
  matchId: z.number(),
  category: z.string(),
  price: z.number(),
  available: z.boolean().default(true),
  colorCode: z.string(),
});

export const insertCartItemSchema = z.object({
  sessionId: z.string(),
  matchId: z.number(),
  categoryId: z.number(),
  quantity: z.number().default(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type SeatCategory = typeof seatCategories.$inferSelect;
export type InsertSeatCategory = z.infer<typeof insertSeatCategorySchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
