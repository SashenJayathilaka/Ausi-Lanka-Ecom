import InStockItemsAdmin from "@/components/admin/stock";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

const Page = () => {
  void trpc.getAdminItems.getAllInStockItems.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <InStockItemsAdmin />
    </HydrateClient>
  );
};

export default Page;
