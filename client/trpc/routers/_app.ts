import { checkoutRouter } from "@/components/checkout-section/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  checkout: checkoutRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
