import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Scan records table for storing deepfake/voice clone detection results
 */
export const scans = mysqlTable("scans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(), // S3 storage key
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl"), // URL if pasted, or S3 URL
  scanType: mysqlEnum("scanType", ["audio", "video"]).notNull(),
  threatScore: int("threatScore").notNull(), // 0-100
  verdict: mysqlEnum("verdict", ["real", "fake", "suspicious"]).notNull(),
  confidence: int("confidence").notNull(), // 0-100
  explanation: text("explanation"), // Plain-language explanation
  isDemo: int("isDemo").default(0).notNull(), // 1 for demo scans, 0 for real
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Scan = typeof scans.$inferSelect;
export type InsertScan = typeof scans.$inferInsert;

/**
 * Demo scans table for pre-loaded sample data
 */
export const demoScans = mysqlTable("demoScans", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  scanType: mysqlEnum("scanType", ["audio", "video"]).notNull(),
  threatScore: int("threatScore").notNull(),
  verdict: mysqlEnum("verdict", ["real", "fake", "suspicious"]).notNull(),
  confidence: int("confidence").notNull(),
  explanation: text("explanation"),
  sampleFileUrl: text("sampleFileUrl"), // URL to sample file
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DemoScan = typeof demoScans.$inferSelect;
export type InsertDemoScan = typeof demoScans.$inferInsert;