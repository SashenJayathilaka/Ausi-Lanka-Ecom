import CompanyLogo from "@/components/home/company-logo";
import FeaturesSection from "@/components/home/features-section";
import Hero from "@/components/home/hero-section";
import MonitorSection from "@/components/home/monitor-section";
import Navbar from "@/components/home/navbar";
import ScheduleSection from "@/components/home/schedule-section";
import ShippingCountdown from "@/components/home/ShippingCountdown";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      <div className="overflow-hidden">
        <Navbar />
        <Hero />
        <CompanyLogo />
        <section id="about" className="w-full bg-gray-50 py-16 px-4 md:px-8">
          <ShippingCountdown targetDate="2025-06-25T10:00:00" />
        </section>
        {/*    <PurposeSection /> */}
        <FeaturesSection />
        <ScheduleSection />
        <MonitorSection />
      </div>
    </main>
  );
}
