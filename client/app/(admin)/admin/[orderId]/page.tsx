import OrderDetails from "@/components/admin";
import { HydrateClient, trpc } from "@/trpc/server";

type Props = {
  params: Promise<{ orderId: string }>;
};

const Page = async ({ params }: Props) => {
  const { orderId } = await params;

  void trpc.getItem.getById.prefetch({ id: orderId });

  return (
    <HydrateClient>
      <OrderDetails orderId={orderId} />
    </HydrateClient>
  );
};

export default Page;
