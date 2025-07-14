import AdminUsers from "@/components/admin/users";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";

const AdminPage = () => {
  void trpc.getUsers.getAllUsers.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <AdminUsers />
    </HydrateClient>
  );
};

export default AdminPage;
