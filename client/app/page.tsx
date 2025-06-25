import CompanyLogo from "@/components/home/company-logo";
import FeaturesSection from "@/components/home/features-section";
import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero-section";
import MonitorSection from "@/components/home/monitor-section";
import Navbar from "@/components/home/navbar";
import NewsletterSection from "@/components/home/newsletter-section";
import ServicesSection from "@/components/home/services-section";
import ShippingCountdown from "@/components/home/ShippingCountdown";
import TestimonialsSection from "@/components/home/testimonials-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      <div className="overflow-hidden">
        <Navbar />
        <Hero />
        <CompanyLogo />
        <section id="about" className="w-full bg-gray-50 py-16 px-4 md:px-8">
          <ShippingCountdown targetDate="2025-06-30T10:00:00" isSmall />
        </section>
        {/*    <PurposeSection /> */}
        <FeaturesSection />
        {/* <ScheduleSection /> */}
        <MonitorSection />
        {/*   <PricingSection /> */}
        <ServicesSection />
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </div>
    </main>
  );
}
