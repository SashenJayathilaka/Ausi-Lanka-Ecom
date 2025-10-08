import CheckoutSections from "@/components/checkout-section";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const CheckoutPage = () => {
  void trpc.getCurrentUserProfile.getCurrentUser.prefetch();

  return (
    <HydrateClient>
      <CheckoutSections />
    </HydrateClient>
  );
};

export default CheckoutPage;
