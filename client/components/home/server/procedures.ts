import { db } from "@/db";
import { nextShipment } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const nextShipmentRouter = createTRPCRouter({
  // Get all upcoming shipments
  getMany: baseProcedure.query(async () => {
    const data = await db
      .select()
      .from(nextShipment)
      .orderBy(desc(nextShipment.shipmentDate));
    return data;
  }),

  // Get the next upcoming shipment (single record)
  getNext: baseProcedure.query(async () => {
    const [data] = await db
      .select()
      .from(nextShipment)
      .orderBy(desc(nextShipment.shipmentDate))
      .limit(1);
    return data;
  }),

  // Create a new shipment record
  create: baseProcedure
    .input(
      z.object({
        shipmentDate: z.date(),
        updatedBy: z.string().uuid(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [newShipment] = await db
        .insert(nextShipment)
        .values({
          shipmentDate: input.shipmentDate,
          updatedBy: input.updatedBy,
          notes: input.notes,
        })
        .returning();
      return newShipment;
    }),

  // Update an existing shipment
  update: baseProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        shipmentDate: z.date().optional(),
        updatedBy: z.string().uuid().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [updatedShipment] = await db
        .update(nextShipment)
        .set({
          shipmentDate: input.shipmentDate,
          updatedBy: input.updatedBy,
          notes: input.notes,
          updatedAt: new Date(),
        })
        .where(eq(nextShipment.id, input.id))
        .returning();
      return updatedShipment;
    }),

  // Delete a shipment
  delete: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(nextShipment).where(eq(nextShipment.id, input.id));
      return { success: true };
    }),
});
