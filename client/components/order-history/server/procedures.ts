import { db } from "@/db";
import { orderItems, orders, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { z } from "zod";

export const getItemRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const ordersData = await db
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.userId, userId),
            cursor
              ? or(
                  lt(orders.updatedAt, cursor.updatedAt),
                  and(
                    eq(orders.updatedAt, cursor.updatedAt),
                    lt(orders.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(orders.updatedAt), desc(orders.id))
        .limit(limit + 1);

      const hasMore = ordersData.length > limit;
      const items = hasMore ? ordersData.slice(0, -1) : ordersData;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      const orderIds = items.map((order) => order.id);
      const allItems =
        orderIds.length > 0
          ? await db
              .select()
              .from(orderItems)
              .where(or(...orderIds.map((id) => eq(orderItems.orderId, id))))
          : [];

      const itemsByOrderId = allItems.reduce((acc, item) => {
        if (!acc[item.orderId]) {
          acc[item.orderId] = [];
        }
        acc[item.orderId]!.push(item);
        return acc;
      }, {} as Record<string, (typeof allItems)[number][]>);

      const user = await db.select().from(users).where(eq(users.id, userId));

      const result = items.map((order) => ({
        ...order,
        items: itemsByOrderId[order.id] || [],
        user: user[0]
          ? {
              id: user[0].id,
              name: user[0].name,
              emailId: user[0].emailId,
              imageUrl: user[0].imageUrl,
            }
          : null,
      }));

      return {
        items: result,
        nextCursor,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;

      const order = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, input.id), eq(orders.userId, userId)))
        .limit(1)
        .then((rows) => rows[0]);

      if (!order) {
        throw new Error("Order not found");
      }

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .then((rows) => rows[0]);

      return {
        ...order,
        items,
        user: user
          ? {
              id: user.id,
              name: user.name,
              emailId: user.emailId,
              imageUrl: user.imageUrl,
            }
          : null,
      };
    }),
});
