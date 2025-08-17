import TrendingItemsAdmin from "@/components/admin/trending";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = () => {
  void trpc.getAdminItems.getAllTrendingItems.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <TrendingItemsAdmin />
    </HydrateClient>
  );
};

export default Page;
