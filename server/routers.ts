import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createScan, getScansByUserId, getScanCount, getDemoScans, getAnalyticsData } from "./db";
import { notifyOwner } from "./_core/notification";


export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  scans: router({
    create: protectedProcedure
      .input(z.object({
        fileKey: z.string(),
        fileName: z.string(),
        fileUrl: z.string(),
        scanType: z.enum(["audio", "video"]),
        threatScore: z.number().min(0).max(100),
        verdict: z.enum(["real", "fake", "suspicious"]),
        confidence: z.number().min(0).max(100),
        explanation: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const scan = await createScan({
          userId: ctx.user.id,
          ...input,
          isDemo: 0,
        });
        
        // Send email notification if threat score > 80%
        if (input.threatScore > 80) {
          await notifyOwner({
            title: "🚨 High-Threat Deepfake Detected",
            content: `A scan with threat score ${input.threatScore}% (${input.verdict}) was detected.\n\nFile: ${input.fileName}\nType: ${input.scanType}\nConfidence: ${input.confidence}%\n\nExplanation: ${input.explanation}`,
          });
        }
        
        return scan;
      }),
    
    list: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ ctx, input }) => {
        const userScans = await getScansByUserId(ctx.user.id, input.limit, input.offset);
        const totalCount = await getScanCount(ctx.user.id);
        return { scans: userScans, totalCount };
      }),
    
    demoList: publicProcedure.query(async () => {
      const demos = await getDemoScans();
      return { scans: demos };
    }),
  }),
  
  analytics: router({
    getData: protectedProcedure.query(async ({ ctx }) => {
      return await getAnalyticsData(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
