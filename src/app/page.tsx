import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ProofBlock } from "@/components/proof-block";
import { TheClaimStats } from "@/components/the-claim-stats";
import { ServicesTabs } from "@/components/services-tabs";
import { HowWeWork } from "@/components/how-we-work";
import { FrameworksSection } from "@/components/frameworks-section";
import { InsightsSection } from "@/components/insights-section";
import { IndustriesSection } from "@/components/industries-section";
import { FreeResourcesSection } from "@/components/free-resources-section";
import { BookingSection } from "@/components/booking-section";
import { TrustSecurity } from "@/components/trust-security";
import { FinalCTASection } from "@/components/final-cta-section";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { ReadingProgress } from "@/components/reading-progress";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ProofBlock />
        <TheClaimStats />
        <ServicesTabs />
        <HowWeWork />
        <FrameworksSection />
        <InsightsSection />
        <IndustriesSection />
        <FreeResourcesSection />
        <BookingSection />
        <TrustSecurity />
        <FinalCTASection />
      </main>
      <Footer />
      <BackToTop />
      <ReadingProgress />
    </>
  );
}
