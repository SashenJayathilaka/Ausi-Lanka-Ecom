import { orderAnalyticsRouter } from "@/components/admin/analytics/server/procedures";
import { getItemsForAdminRouter } from "@/components/admin/server/procedures";
import { checkoutRouter } from "@/components/checkout-section/server/procedures";
import { nextShipmentRouter } from "@/components/home/server/procedures";
import { getItemRouter } from "@/components/order-history/server/procedures";
import { getUsers } from "@/components/product/server/procedures";
import { createTRPCRouter } from "../init";
import { scrapeRouter } from "@/components/server/procedures";

export const appRouter = createTRPCRouter({
  checkout: checkoutRouter,
  getItem: getItemRouter,
  getAdminItems: getItemsForAdminRouter,
  getUsers: getUsers,
  getNextShipmentRouter: nextShipmentRouter,
  orderAnalyticsRouter: orderAnalyticsRouter,
  productScrapeRouter: scrapeRouter,
});

export type AppRouter = typeof appRouter;
