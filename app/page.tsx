"use client";

import React from "react";
import LandingPageHeader from "./components/landing-page/header/header";
import LandingPageHeroSection from "./components/landing-page/hero/HeroSection";
import LandingPageCTA from "./components/landing-page/cta/cta";
import LandingPageContact from "./components/landing-page/contact/contact";
import LandingPageFooter from "./components/landing-page/footer/footer";

// Teste
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageHeader />
      <LandingPageHeroSection />
      <LandingPageCTA />
      <LandingPageContact />
      <LandingPageFooter />
    </div>
  );
}
