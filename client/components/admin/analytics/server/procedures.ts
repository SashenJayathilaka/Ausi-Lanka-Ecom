import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, asc, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";

export const orderAnalyticsRouter = createTRPCRouter({
  getStatusDistribution: protectedProcedure.query(async () => {
    const statusCounts = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)::int`,
      })
      .from(orders)
      .groupBy(orders.status)
      .orderBy(asc(orders.status));

    return statusCounts;
  }),
  getDeliveryMethodDistribution: protectedProcedure.query(async () => {
    const methodCounts = await db
      .select({
        method: orders.deliveryMethod,
        count: sql<number>`count(*)::int`,
      })
      .from(orders)
      .groupBy(orders.deliveryMethod)
      .orderBy(asc(orders.deliveryMethod));

    return methodCounts;
  }),
  getSalesByDistrict: protectedProcedure.query(async () => {
    const districtSales = await db
      .select({
        district: orders.district,
        totalSales: sql<number>`sum(${orders.totalAmount})`,
        orderCount: sql<number>`count(*)::int`,
      })
      .from(orders)
      .groupBy(orders.district)
      .orderBy(sql`sum(${orders.totalAmount}) DESC`);

    return districtSales;
  }),
  getSalesByRetailer: protectedProcedure.query(async () => {
    const retailerSales = await db
      .select({
        retailer: orderItems.retailer,
        totalSales: sql<number>`sum(${orderItems.calculatedPrice} * ${orderItems.quantity})`,
        orderCount: sql<number>`count(distinct ${orderItems.orderId})::int`,
      })
      .from(orderItems)
      .groupBy(orderItems.retailer)
      .orderBy(
        sql`sum(${orderItems.calculatedPrice} * ${orderItems.quantity}) DESC`
      );

    return retailerSales;
  }),
  getMonthlySales: protectedProcedure
    .input(
      z.object({
        year: z.number().optional().default(new Date().getFullYear()),
        months: z.number().min(1).max(12).optional().default(12),
      })
    )
    .query(async ({ input }) => {
      const monthRanges = Array.from({ length: input.months }, (_, i) => {
        const date = new Date(input.year, i, 1);
        return {
          name: date.toLocaleString("default", { month: "short" }),
          start: new Date(input.year, i, 1),
          end: new Date(input.year, i + 1, 0, 23, 59, 59),
        };
      });

      const monthlySales = await Promise.all(
        monthRanges.map(async (month) => {
          // Use .execute() instead of .get()
          const result = await db
            .select({
              totalSales: sql<number>`sum(${orders.totalAmount})`,
              orderCount: sql<number>`count(*)::int`,
            })
            .from(orders)
            .where(
              and(
                gte(orders.createdAt, month.start),
                lte(orders.createdAt, month.end)
              )
            )
            .execute(); // Changed from .get() to .execute()

          // Access the first element of the result array
          return {
            month: month.name,
            year: input.year,
            totalSales: result[0]?.totalSales || 0,
            orderCount: result[0]?.orderCount || 0,
          };
        })
      );

      return monthlySales;
    }),
});
