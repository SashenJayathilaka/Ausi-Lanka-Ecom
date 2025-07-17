import AdminShipment from "@/components/admin/shipment";
import { HydrateClient, trpc } from "@/trpc/server";

const AdminPage = () => {
  void trpc.getNextShipmentRouter.getNext.prefetch();

  return (
    <HydrateClient>
      <AdminShipment />
    </HydrateClient>
  );
};

export default AdminPage;
