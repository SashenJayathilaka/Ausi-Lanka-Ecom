import { db } from "@/db";
import { orderItems, orders, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray, lt, or } from "drizzle-orm";
import { z } from "zod";

export const getItemsForAdminRouter = createTRPCRouter({
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

      // Verify admin status
      const adminUser = await db
        .select()
        .from(users)
        .where(and(eq(users.id, userId), eq(users.userType, "admin")))
        .limit(1)
        .then((rows) => rows[0]);

      if (!adminUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admin users can access order details",
        });
      }

      // Get orders with pagination
      const ordersData = await db
        .select()
        .from(orders)
        .where(
          and(
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

      // Get all unique user IDs from the orders
      const userIds = [...new Set(items.map((order) => order.userId))];

      // Fetch all users associated with these orders in a single query
      const orderUsers =
        userIds.length > 0
          ? await db
              .select({
                id: users.id,
                name: users.name,
                emailId: users.emailId,
                imageUrl: users.imageUrl,
              })
              .from(users)
              .where(inArray(users.id, userIds))
          : [];

      // Create a map of users by their ID for quick lookup
      const usersById = orderUsers.reduce(
        (acc, user) => {
          acc[user.id] = user;
          return acc;
        },
        {} as Record<string, (typeof orderUsers)[number]>
      );

      // Get all order items for these orders in a single query
      const orderIds = items.map((order) => order.id);
      const allItems =
        orderIds.length > 0
          ? await db
              .select()
              .from(orderItems)
              .where(inArray(orderItems.orderId, orderIds))
          : [];

      // Group items by order ID
      const itemsByOrderId = allItems.reduce(
        (acc, item) => {
          if (!acc[item.orderId]) {
            acc[item.orderId] = [];
          }
          acc[item.orderId].push(item);
          return acc;
        },
        {} as Record<string, (typeof allItems)[number][]>
      );

      // Combine all data
      const result = items.map((order) => ({
        ...order,
        items: itemsByOrderId[order.id] || [],
        user: usersById[order.userId] || null, // The user who placed the order
      }));

      return {
        items: result,
        nextCursor,
      };
    }),
  getAllProducts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().uuid().nullish(),
        orderId: z.string().uuid().optional(),
      })
    )
    .output(
      z.object({
        products: z.array(
          z.object({
            id: z.string().uuid(),
            orderId: z.string().uuid(),
            name: z.string(),
            price: z.string(),
            image: z.string(),
            url: z.string().nullable(),
            retailer: z.string(),
            calculatedPrice: z.string(),
            quantity: z.number().int(),
            createdAt: z.date(),
          })
        ),
        nextCursor: z.string().uuid().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized: Admin access required",
        });
      }
      const baseQuery = db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          name: orderItems.name,
          price: orderItems.price,
          image: orderItems.image,
          url: orderItems.url,
          retailer: orderItems.retailer,
          calculatedPrice: orderItems.calculatedPrice,
          quantity: orderItems.quantity,
          createdAt: orderItems.createdAt,
        })
        .from(orderItems)
        .orderBy(desc(orderItems.createdAt), desc(orderItems.id))
        .limit(input.limit + 1);

      if (input.orderId) {
        baseQuery.where(eq(orderItems.orderId, input.orderId));
      }

      if (input.cursor) {
        baseQuery.where(
          or(
            lt(
              orderItems.createdAt,
              db
                .select({ createdAt: orderItems.createdAt })
                .from(orderItems)
                .where(eq(orderItems.id, input.cursor))
            ),
            and(
              eq(
                orderItems.createdAt,
                db
                  .select({ createdAt: orderItems.createdAt })
                  .from(orderItems)
                  .where(eq(orderItems.id, input.cursor))
              ),
              lt(orderItems.id, input.cursor)
            )
          )
        );
      }

      const results = await baseQuery;

      let nextCursor = null;
      if (results.length > input.limit) {
        const lastItem = results[input.limit - 1];
        nextCursor = lastItem.id;
      }

      const formattedResults = results.slice(0, input.limit).map((item) => ({
        ...item,
        price: item.price.toString(),
        calculatedPrice: item.calculatedPrice.toString(),
      }));

      return {
        products: formattedResults,
        nextCursor,
      };
    }),
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        status: z.enum([
          "pending",
          "confirmed",
          "shipped",
          "delivered",
          "cancelled",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update order status",
        });
      }

      const [updatedOrder] = await db
        .update(orders)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, input.orderId))
        .returning({
          id: orders.id,
          status: orders.status,
          updatedAt: orders.updatedAt,
        });

      if (!updatedOrder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return updatedOrder;
    }),
});
