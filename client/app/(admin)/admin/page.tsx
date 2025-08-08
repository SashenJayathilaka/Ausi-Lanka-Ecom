import AnalyticsPage from "@/components/admin/analytics";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const AdminPage = () => {
  void trpc.orderAnalyticsRouter.getStatusDistribution.prefetch();
  void trpc.orderAnalyticsRouter.getDeliveryMethodDistribution.prefetch();
  void trpc.orderAnalyticsRouter.getSalesByDistrict.prefetch();
  void trpc.orderAnalyticsRouter.getSalesByRetailer.prefetch();

  return (
    <HydrateClient>
      <AnalyticsPage />
    </HydrateClient>
  );
};

export default AdminPage;
