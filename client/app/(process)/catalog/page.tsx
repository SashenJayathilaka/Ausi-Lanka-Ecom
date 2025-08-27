import CatalogSection from "@/components/catalog";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const CatalogPage = () => {
  void trpc.getAdminItems.getAllTrendingItems.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <CatalogSection />
    </HydrateClient>
  );
};

export default CatalogPage;
