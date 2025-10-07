import CurrentUserProfile from "@/components/profile";
import { DEFAULT_LIMIT } from "@/constants/constants";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const AdminPage = () => {
  void trpc.getCurrentUserProfile.getCurrentUser.prefetch();
  void trpc.getItem.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <CurrentUserProfile />
    </HydrateClient>
  );
};

export default AdminPage;
