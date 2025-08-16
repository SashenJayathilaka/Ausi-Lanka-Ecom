import { db } from "@/db";
import { inStock, orderItems, orders, trendingItems, users } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
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

  // Add get, update , delete procedures for trending items
  getAllTrendingItems: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().uuid().nullish(),
      })
    )
    .output(
      z.object({
        items: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string(),
            price: z.string(),
            image: z.string(),
            rating: z.number(),
            url: z.string().nullable(),
            retailer: z.string(),
            calculatedPrice: z.string(),
            quantity: z.number().int(),
            badge: z
              .enum(["BESTSELLER", "LIMITED", "POPULAR", "NEW"])
              .nullable(),
            createdAt: z.date(),
          })
        ),
        nextCursor: z.string().uuid().nullish(),
      })
    )
    .query(async ({ input }) => {
      const baseQuery = db
        .select()
        .from(trendingItems)
        .orderBy(desc(trendingItems.createdAt), desc(trendingItems.id))
        .limit(input.limit + 1);

      if (input.cursor) {
        baseQuery.where(
          or(
            lt(
              trendingItems.createdAt,
              db
                .select({ createdAt: trendingItems.createdAt })
                .from(trendingItems)
                .where(eq(trendingItems.id, input.cursor))
            ),
            and(
              eq(
                trendingItems.createdAt,
                db
                  .select({ createdAt: trendingItems.createdAt })
                  .from(trendingItems)
                  .where(eq(trendingItems.id, input.cursor))
              ),
              lt(trendingItems.id, input.cursor)
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
        items: formattedResults,
        nextCursor,
      };
    }),

  createTrendingItem: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.string().min(1),
        image: z.string().min(1),
        rating: z.number().min(0).max(5),
        url: z.string().optional(),
        retailer: z.string().min(1),
        calculatedPrice: z.string().min(1),
        quantity: z.number().min(1),
        badge: z.enum(["BESTSELLER", "LIMITED", "POPULAR", "NEW"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized: Admin access required",
        });
      }

      const [newItem] = await db
        .insert(trendingItems)
        .values({
          userId: ctx.user.id,
          name: input.name,
          price: input.price,
          image: input.image,
          rating: input.rating,
          url: input.url,
          retailer: input.retailer,
          calculatedPrice: input.calculatedPrice,
          quantity: input.quantity,
          badge: input.badge,
        })
        .returning();

      return {
        ...newItem,
        price: newItem.price.toString(),
        calculatedPrice: newItem.calculatedPrice.toString(),
      };
    }),

  updateTrendingItem: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        price: z.string().min(1).optional(),
        image: z.string().min(1).optional(),
        rating: z.number().min(0).max(5).optional(),
        url: z.string().optional(),
        retailer: z.string().min(1).optional(),
        calculatedPrice: z.string().min(1).optional(),
        quantity: z.number().min(1).optional(),
        badge: z
          .enum(["BESTSELLER", "LIMITED", "POPULAR", "NEW"])
          .optional()
          .nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized: Admin access required",
        });
      }

      const [updatedItem] = await db
        .update(trendingItems)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(trendingItems.id, input.id))
        .returning();

      if (!updatedItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trending item not found",
        });
      }

      return {
        ...updatedItem,
        price: updatedItem.price.toString(),
        calculatedPrice: updatedItem.calculatedPrice.toString(),
      };
    }),
  deleteTrendingItem: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized: Admin access required",
        });
      }

      // First check if item exists
      const [item] = await db
        .select()
        .from(trendingItems)
        .where(eq(trendingItems.id, input.id))
        .limit(1);

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trending item not found",
        });
      }

      // Delete the item
      await db.delete(trendingItems).where(eq(trendingItems.id, input.id));

      return {
        success: true,
        message: "Trending item deleted successfully",
      };
    }),

  // Add get, update, delete procedures for in-stock items
  getAllInStockItems: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().uuid().nullish(),
        category: z.string().optional(),
      })
    )
    .output(
      z.object({
        items: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string(),
            sku: z.string(),
            price: z.string(),
            originalPrice: z.string().nullable(),
            image: z.string(),
            url: z.string().nullable(),
            retailer: z.string(),
            quantity: z.number().int(),
            threshold: z.number().int(),
            location: z.string().nullable(),
            category: z.string().nullable(),
            description: z.string().nullable(),
            isActive: z.boolean(),
            createdAt: z.date(),
          })
        ),
        nextCursor: z.string().uuid().nullish(),
      })
    )
    .query(async ({ input }) => {
      const baseQuery = db
        .select()
        .from(inStock)
        .orderBy(desc(inStock.createdAt), desc(inStock.id))
        .limit(input.limit + 1);

      if (input.cursor) {
        baseQuery.where(
          or(
            lt(
              inStock.createdAt,
              db
                .select({ createdAt: inStock.createdAt })
                .from(inStock)
                .where(eq(inStock.id, input.cursor))
            ),
            and(
              eq(
                inStock.createdAt,
                db
                  .select({ createdAt: inStock.createdAt })
                  .from(inStock)
                  .where(eq(inStock.id, input.cursor))
              ),
              lt(inStock.id, input.cursor)
            )
          )
        );
      }

      if (input.category) {
        baseQuery.where(eq(inStock.category, input.category));
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
        originalPrice: item.originalPrice?.toString() ?? null,
      }));

      return {
        items: formattedResults,
        nextCursor,
      };
    }),

  createInStockItem: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        sku: z.string().min(1),
        price: z.string().min(1),
        originalPrice: z.string().optional(),
        image: z.string().min(1),
        url: z.string().optional(),
        retailer: z.string().min(1),
        quantity: z.number().min(0),
        threshold: z.number().min(0).default(5),
        location: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [newItem] = await db
        .insert(inStock)
        .values({
          userId: ctx.user.id,
          name: input.name,
          sku: input.sku,
          price: input.price,
          originalPrice: input.originalPrice,
          image: input.image,
          url: input.url,
          retailer: input.retailer,
          quantity: input.quantity,
          threshold: input.threshold,
          location: input.location,
          category: input.category,
          description: input.description,
        })
        .returning();

      return {
        ...newItem,
        price: newItem.price.toString(),
        originalPrice: newItem.originalPrice?.toString() ?? null,
      };
    }),

  updateInStockItem: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        sku: z.string().min(1).optional(),
        price: z.string().min(1).optional(),
        originalPrice: z.string().optional(),
        image: z.string().min(1).optional(),
        url: z.string().optional(),
        retailer: z.string().min(1).optional(),
        quantity: z.number().min(0).optional(),
        threshold: z.number().min(0).optional(),
        location: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized: Admin access required",
        });
      }

      const [updatedItem] = await db
        .update(inStock)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(inStock.id, input.id))
        .returning();

      if (!updatedItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "In-stock item not found",
        });
      }

      return {
        ...updatedItem,
        price: updatedItem.price.toString(),
        originalPrice: updatedItem.originalPrice?.toString() ?? null,
      };
    }),

  deleteInStockItem: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized: Admin access required",
        });
      }

      const [item] = await db
        .select()
        .from(inStock)
        .where(eq(inStock.id, input.id))
        .limit(1);

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "In-stock item not found",
        });
      }

      await db.delete(inStock).where(eq(inStock.id, input.id));

      return {
        success: true,
        message: "In-stock item deleted successfully",
      };
    }),
});
