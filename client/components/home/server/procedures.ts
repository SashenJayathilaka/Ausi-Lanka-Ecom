import { db } from "@/db";
import { nextShipment } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const nextShipmentRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async () => {
    const data = await db
      .select()
      .from(nextShipment)
      .orderBy(desc(nextShipment.shipmentDate));
    return data;
  }),

  getNext: baseProcedure.query(async () => {
    const [data] = await db
      .select()
      .from(nextShipment)
      .orderBy(desc(nextShipment.shipmentDate))
      .limit(1);
    return data ?? null;
  }),

  create: protectedProcedure
    .input(
      z.object({
        shipmentDate: z.date(),
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

      const [newShipment] = await db
        .insert(nextShipment)
        .values({
          shipmentDate: input.shipmentDate,
          updatedBy: ctx.user.id,
          notes: input.notes,
        })
        .returning();
      return newShipment;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        shipmentDate: z.date().optional(),
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

      const [updatedShipment] = await db
        .update(nextShipment)
        .set({
          shipmentDate: input.shipmentDate,
          updatedBy: ctx.user.id,
          notes: input.notes,
          updatedAt: new Date(),
        })
        .where(eq(nextShipment.id, input.id))
        .returning();
      return updatedShipment;
    }),

  delete: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(nextShipment).where(eq(nextShipment.id, input.id));
      return { success: true };
    }),
});
