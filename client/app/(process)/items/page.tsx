import Items from "@/components/items";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = () => {
  void trpc.getAdminItems.getAllTrendingItems.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  void trpc.getAdminItems.getAllInStockItems.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <Items />
    </HydrateClient>
  );
};

export default Page;
