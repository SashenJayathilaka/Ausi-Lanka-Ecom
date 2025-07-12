import { getItemsForAdminRouter } from "@/components/admin/server/procedures";
import { checkoutRouter } from "@/components/checkout-section/server/procedures";
import { getItemRouter } from "@/components/order-history/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  checkout: checkoutRouter,
  getItem: getItemRouter,
  getAdminItems: getItemsForAdminRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
