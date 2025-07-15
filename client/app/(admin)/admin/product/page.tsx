import AdminOrders from "@/components/admin/products";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";

const AdminPage = () => {
  void trpc.getAdminItems.getAllProducts.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <AdminOrders />
    </HydrateClient>
  );
};

export default AdminPage;
