import CompanyLogo from "@/components/home/company-logo";
import FeaturesSection from "@/components/home/features-section";
import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero-section";
import MonitorSection from "@/components/home/monitor-section";
import SessionIn from "@/components/home/navbar/sessionIn";
import SessionNot from "@/components/home/navbar/sessionNot";
import ServicesSection from "@/components/home/services-section";
import ShippingCountdown from "@/components/home/ShippingCountdown";
import TestimonialsSection from "@/components/home/testimonials-section";
import { HydrateClient, trpc } from "@/trpc/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const { userId } = session;
  const user = userId ? await currentUser() : null;
  void trpc.getNextShipmentRouter.getNext.prefetch();

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      <div className="overflow-hidden">
        {user ? <SessionIn /> : <SessionNot />}
        <Hero />
        <CompanyLogo />
        <HydrateClient>
          <ShippingCountdown isSmall />
        </HydrateClient>
        <FeaturesSection />
        <MonitorSection />
        <ServicesSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </main>
  );
}
