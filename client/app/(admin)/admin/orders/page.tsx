import OrderAdminDetails from "@/components/admin/order-admin-details";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";

const AdminPage = () => {
  void trpc.getAdminItems.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <OrderAdminDetails />
    </HydrateClient>
  );
};

export default AdminPage;
