import { db } from "@/db";
import { latestDollarRate } from "@/db/schema";
import { baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const dollarRateRouter = {
  create: protectedProcedure
    .input(
      z.object({
        rate: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found in database",
        });
      }

      const [newRate] = await db
        .insert(latestDollarRate)
        .values({
          rate: input.rate?.toString(),
          updatedBy: ctx.user.id,
          notes: input.notes,
        })
        .returning();
      return newRate;
    }),

  // UPDATE an existing rate
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        rate: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found in database",
        });
      }

      const [updatedRate] = await db
        .update(latestDollarRate)
        .set({
          rate: input.rate?.toString(),
          updatedBy: ctx.user.id,
          notes: input.notes,
          updatedAt: new Date(),
        })
        .where(eq(latestDollarRate.id, input.id))
        .returning();
      return updatedRate;
    }),

  // GET the latest dollar rate
  getLatest: baseProcedure.query(async () => {
    const [data] = await db
      .select()
      .from(latestDollarRate)
      .orderBy(desc(latestDollarRate.createdAt))
      .limit(1);
    return data ?? null;
  }),
};
