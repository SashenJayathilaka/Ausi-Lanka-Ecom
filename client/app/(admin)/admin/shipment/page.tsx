import AdminShipment from "@/components/admin/shipment";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";

const AdminPage = () => {
  void trpc.getUsers.getAllUsers.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <AdminShipment />
    </HydrateClient>
  );
};

export default AdminPage;
