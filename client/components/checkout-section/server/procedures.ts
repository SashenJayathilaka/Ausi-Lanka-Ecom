import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const createOrderInput = z.object({
  name: z.string().min(1),
  mobile: z.string().min(10).max(20),
  deliveryMethod: z.enum(["sea", "air", "express"]),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  district: z.string().min(1),
  postalCode: z.string().min(1).max(20),
  comments: z.string().optional(),
  missingItems: z.array(z.string()).optional(),
  totalAmount: z.number().positive(),
  items: z.array(
    z.object({
      name: z.string().min(1),
      price: z.number().positive(),
      image: z.string().min(1),
      url: z.string().optional(),
      retailer: z.string().min(1),
      calculatedPrice: z.number().positive(),
      quantity: z.number().int().min(1),
    })
  ),
});

export const checkoutRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createOrderInput)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      // Insert order
      const [order] = await db
        .insert(orders)
        .values({
          userId,
          name: input.name,
          mobile: input.mobile,
          deliveryMethod: input.deliveryMethod,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2 ?? null,
          city: input.city,
          district: input.district,
          postalCode: input.postalCode,
          comments: input.comments ?? null,
          missingItems: input.missingItems ?? null,
          totalAmount: input.totalAmount.toString(),
          status: "pending",
        })
        .returning();

      // Insert order items
      await db.insert(orderItems).values(
        input.items.map((item) => ({
          orderId: order.id,
          name: item.name,
          price: item.price.toString(),
          image: item.image,
          url: item.url ?? null,
          retailer: item.retailer,
          calculatedPrice: item.calculatedPrice.toString(),
          quantity: item.quantity,
        }))
      );

      return {
        orderId: order.id,
        message: "Order successfully placed!",
      };
    }),
});
