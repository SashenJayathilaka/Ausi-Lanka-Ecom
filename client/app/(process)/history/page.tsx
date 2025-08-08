import { OrderHistoryPage } from "@/components/order-history";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

export const dynamic = "force-dynamic";

const Page = () => {
  void trpc.getItem.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <OrderHistoryPage />
    </HydrateClient>
  );
};

export default Page;
