import { checkoutRouter } from "@/components/checkout-section/server/procedures";
import { createTRPCRouter } from "../init";
import { getItemRouter } from "@/components/order-history/server/procedures";

export const appRouter = createTRPCRouter({
  checkout: checkoutRouter,
  getItem: getItemRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
