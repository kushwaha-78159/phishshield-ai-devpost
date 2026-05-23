import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("scans router", () => {
  describe("scans.create", () => {
    it("should create a scan with valid input", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.scans.create({
        fileKey: "test-file-key-123",
        fileName: "test-video.mp4",
        fileUrl: "https://example.com/test-video.mp4",
        scanType: "video",
        threatScore: 85,
        verdict: "fake",
        confidence: 92,
        explanation: "Test explanation for deepfake detection",
      });

      expect(result).toBeDefined();
      expect(result?.fileKey).toBe("test-file-key-123");
      expect(result?.fileName).toBe("test-video.mp4");
      expect(result?.scanType).toBe("video");
      expect(result?.threatScore).toBe(85);
      expect(result?.verdict).toBe("fake");
      expect(result?.confidence).toBe(92);
      expect(result?.userId).toBe(ctx.user.id);
      expect(result?.isDemo).toBe(0);
    });

    it("should create a scan with audio type", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.scans.create({
        fileKey: "audio-key-456",
        fileName: "voice-clone.mp3",
        fileUrl: "https://example.com/voice-clone.mp3",
        scanType: "audio",
        threatScore: 78,
        verdict: "suspicious",
        confidence: 65,
        explanation: "Audio shows minor anomalies",
      });

      expect(result?.scanType).toBe("audio");
      expect(result?.threatScore).toBe(78);
      expect(result?.verdict).toBe("suspicious");
    });

    it("should create a scan with real verdict", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.scans.create({
        fileKey: "real-file-789",
        fileName: "authentic-video.mp4",
        fileUrl: "https://example.com/authentic.mp4",
        scanType: "video",
        threatScore: 15,
        verdict: "real",
        confidence: 98,
        explanation: "Content appears authentic",
      });

      expect(result?.verdict).toBe("real");
      expect(result?.threatScore).toBe(15);
    });

    it("should validate threat score range", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Test that threat score must be between 0-100
      try {
        await caller.scans.create({
          fileKey: "invalid-score",
          fileName: "test.mp4",
          fileUrl: "https://example.com/test.mp4",
          scanType: "video",
          threatScore: 150, // Invalid: > 100
          verdict: "fake",
          confidence: 90,
          explanation: "Test",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should validate confidence range", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.scans.create({
          fileKey: "invalid-confidence",
          fileName: "test.mp4",
          fileUrl: "https://example.com/test.mp4",
          scanType: "video",
          threatScore: 50,
          verdict: "fake",
          confidence: -10, // Invalid: < 0
          explanation: "Test",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("scans.list", () => {
    it("should list scans for authenticated user", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      // First create some scans
      await caller.scans.create({
        fileKey: "scan-1",
        fileName: "video1.mp4",
        fileUrl: "https://example.com/video1.mp4",
        scanType: "video",
        threatScore: 80,
        verdict: "fake",
        confidence: 90,
        explanation: "Test scan 1",
      });

      // List scans
      const result = await caller.scans.list({ limit: 10, offset: 0 });

      expect(result).toBeDefined();
      expect(result.scans).toBeDefined();
      expect(Array.isArray(result.scans)).toBe(true);
      expect(result.totalCount).toBeGreaterThanOrEqual(1);
    });

    it("should respect pagination limit", async () => {
      const ctx = createAuthContext(2);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.scans.list({ limit: 5, offset: 0 });

      expect(result.scans.length).toBeLessThanOrEqual(5);
    });

    it("should respect pagination offset", async () => {
      const ctx = createAuthContext(3);
      const caller = appRouter.createCaller(ctx);

      const result1 = await caller.scans.list({ limit: 10, offset: 0 });
      const result2 = await caller.scans.list({ limit: 10, offset: 5 });

      // Results should be different if there are enough scans
      if (result1.totalCount > 5) {
        expect(result1.scans).not.toEqual(result2.scans);
      }
    });
  });

  describe("scans.demoList", () => {
    it("should list demo scans without authentication", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      } as TrpcContext);

      const result = await caller.scans.demoList();

      expect(result).toBeDefined();
      expect(result.scans).toBeDefined();
      expect(Array.isArray(result.scans)).toBe(true);
      // Should have demo scans
      expect(result.scans.length).toBeGreaterThan(0);
    });

    it("demo scans should have required fields", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      } as TrpcContext);

      const result = await caller.scans.demoList();

      result.scans.forEach((scan: any) => {
        expect(scan.title).toBeDefined();
        expect(scan.scanType).toMatch(/^(audio|video)$/);
        expect(scan.threatScore).toBeGreaterThanOrEqual(0);
        expect(scan.threatScore).toBeLessThanOrEqual(100);
        expect(scan.verdict).toMatch(/^(real|fake|suspicious)$/);
        expect(scan.confidence).toBeGreaterThanOrEqual(0);
        expect(scan.confidence).toBeLessThanOrEqual(100);
        expect(scan.explanation).toBeDefined();
      });
    });
  });

  describe("analytics.getData", () => {
    it("should return analytics data for authenticated user", async () => {
      const ctx = createAuthContext(4);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.analytics.getData();

      expect(result).toBeDefined();
      expect(result.verdictCounts).toBeDefined();
      expect(result.dailyScans).toBeDefined();
      expect(Array.isArray(result.verdictCounts)).toBe(true);
      expect(Array.isArray(result.dailyScans)).toBe(true);
    });

    it("should return verdict counts with correct structure", async () => {
      const ctx = createAuthContext(5);
      const caller = appRouter.createCaller(ctx);

      // Create some scans first
      await caller.scans.create({
        fileKey: "analytics-test-1",
        fileName: "test1.mp4",
        fileUrl: "https://example.com/test1.mp4",
        scanType: "video",
        threatScore: 85,
        verdict: "fake",
        confidence: 90,
        explanation: "Test",
      });

      const result = await caller.analytics.getData();

      result.verdictCounts.forEach((item: any) => {
        expect(item.verdict).toMatch(/^(real|fake|suspicious)$/);
        expect(typeof item.count).toBe("number");
        expect(item.count).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("authentication", () => {
    it("should require authentication for scans.create", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      } as TrpcContext);

      try {
        await caller.scans.create({
          fileKey: "test",
          fileName: "test.mp4",
          fileUrl: "https://example.com/test.mp4",
          scanType: "video",
          threatScore: 50,
          verdict: "fake",
          confidence: 80,
          explanation: "Test",
        });
        expect.fail("Should have thrown unauthorized error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should require authentication for scans.list", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      } as TrpcContext);

      try {
        await caller.scans.list({ limit: 10, offset: 0 });
        expect.fail("Should have thrown unauthorized error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should require authentication for analytics.getData", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      } as TrpcContext);

      try {
        await caller.analytics.getData();
        expect.fail("Should have thrown unauthorized error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should allow public access to demoList", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      } as TrpcContext);

      // Should not throw
      const result = await caller.scans.demoList();
      expect(result).toBeDefined();
    });
  });
});
