"use client";

import dynamic from "next/dynamic";
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
import { CookieConsent } from "@/components/cookie-consent";
import { useIntroState } from "@/hooks/use-intro-state";

const HeroIntro = dynamic(
  () => import("@/components/hero-intro").then((mod) => ({ default: mod.HeroIntro })),
  { ssr: false }
);

export default function Home() {
  const { showIntro, introComplete, skipIntro, completeIntro } = useIntroState();

  // The nav fades down only once the intro has actually played and revealed.
  const handleIntroDone = () => {
    document.documentElement.dataset.intro = "complete";
    completeIntro();
  };
  const handleSkip = () => {
    document.documentElement.dataset.intro = "complete";
    skipIntro();
  };

  return (
    <>
      {showIntro && (
        <>
          <div className="intro-boot-cover" aria-hidden="true" />
          <HeroIntro onComplete={handleIntroDone} onSkip={handleSkip} />
        </>
      )}
      <Navbar />
      <main id="main-content">
        <HeroSection introComplete={introComplete} />
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
      <CookieConsent />
    </>
  );
}
