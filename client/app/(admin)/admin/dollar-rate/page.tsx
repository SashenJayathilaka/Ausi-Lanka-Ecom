import AdminDollarRate from "@/components/admin/dolor-rate";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const DolorRatePge = () => {
  void trpc.getDollarRateRouter.getLatest.prefetch();

  return (
    <HydrateClient>
      <AdminDollarRate />
    </HydrateClient>
  );
};

export default DolorRatePge;
