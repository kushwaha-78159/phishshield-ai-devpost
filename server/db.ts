import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, scans, InsertScan, Scan, demoScans, InsertDemoScan, DemoScan } from "../drizzle/schema";
import { ENV } from './_core/env';


let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createScan(scan: InsertScan): Promise<Scan | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(scans).values(scan);
    const scanId = result[0].insertId;
    const rows = await db.select().from(scans).where(eq(scans.id, Number(scanId))).limit(1);
    return rows[0];
  } catch (error) {
    console.error("[Database] Failed to create scan:", error);
    throw error;
  }
}

export async function getScansByUserId(userId: number, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(scans)
      .where(eq(scans.userId, userId))
      .orderBy((t) => desc(t.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get scans:", error);
    throw error;
  }
}

export async function getScanCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(scans)
      .where(eq(scans.userId, userId));
    return result[0]?.count || 0;
  } catch (error) {
    console.error("[Database] Failed to get scan count:", error);
    throw error;
  }
}

export async function getDemoScans(): Promise<DemoScan[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select().from(demoScans).orderBy((t) => desc(t.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get demo scans:", error);
    throw error;
  }
}

export async function createDemoScan(demoScan: InsertDemoScan): Promise<DemoScan | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(demoScans).values(demoScan);
    const scanId = result[0].insertId;
    const rows = await db.select().from(demoScans).where(eq(demoScans.id, Number(scanId))).limit(1);
    return rows[0];
  } catch (error) {
    console.error("[Database] Failed to create demo scan:", error);
    throw error;
  }
}

export async function getAnalyticsData(userId: number) {
  const db = await getDb();
  if (!db) return { verdictCounts: {}, dailyScans: [] };

  try {
    // Get verdict distribution
    const verdictCounts = await db
      .select({
        verdict: scans.verdict,
        count: sql<number>`count(*)`,
      })
      .from(scans)
      .where(eq(scans.userId, userId))
      .groupBy((t) => t.verdict);

    // Get daily scan counts for last 30 days
    const dailyScans = await db
      .select({
        date: sql<string>`DATE(createdAt)`,
        count: sql<number>`count(*)`,
      })
      .from(scans)
      .where(eq(scans.userId, userId))
      .groupBy((t) => sql`DATE(createdAt)`)
      .orderBy((t) => sql`DATE(createdAt)`);

    return { verdictCounts, dailyScans };
  } catch (error) {
    console.error("[Database] Failed to get analytics data:", error);
    throw error;
  }
}
