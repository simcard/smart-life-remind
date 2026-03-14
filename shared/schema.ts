import { pgTable, uuid, text, boolean, timestamp, date, time, decimal, integer, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const planTypeEnum = pgEnum("plan_type", ["family", "business"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().unique(),
  full_name: text("full_name"),
  email: text("email"),
  avatar_url: text("avatar_url"),
  plan_type: planTypeEnum("plan_type").default("family"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  plan_type: planTypeEnum("plan_type").default("family"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const familyMembers = pgTable("family_members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  account_owner_id: uuid("account_owner_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  relationship: text("relationship"),
  avatar_url: text("avatar_url"),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull(),
  assigned_member_id: uuid("assigned_member_id"),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  priority: text("priority").notNull().default("medium"),
  due_date: date("due_date").notNull(),
  due_time: time("due_time"),
  completed: boolean("completed").notNull().default(false),
  completed_at: timestamp("completed_at", { withTimezone: true }),
  location: text("location"),
  reminder_location: text("reminder_location"),
  location_lat: decimal("location_lat", { precision: 10, scale: 8 }),
  location_lng: decimal("location_lng", { precision: 11, scale: 8 }),
  location_radius: integer("location_radius").default(500),
  notification_preferences: text("notification_preferences").array().default(["app"]),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  recipient_member_id: uuid("recipient_member_id").notNull(),
  reminder_id: uuid("reminder_id").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userLocations = pgTable("user_locations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = typeof familyMembers.$inferInsert;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = typeof reminders.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type UserLocation = typeof userLocations.$inferSelect;
