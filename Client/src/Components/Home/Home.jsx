import React from "react";
import HeroSection from "./HeroSection";
import SpaceTypeCategories from "./SpaceTypeCategories";
import WhyChooseDigitalScreens from "./whyChoose";
import ImpactStats from './ImpactStats';
import ClientLogos from './ClientLogos';
import FAQSection from './FAQSection';



const DigitalAds = () => {
  const isSubmitting = false;

  return (
    <div className=" space-y-16">
      {/* Hero Section */}
      <HeroSection />
      <section className="my-12">
        <SpaceTypeCategories />
      </section>

    <WhyChooseDigitalScreens/>
    <ImpactStats/>
    <ClientLogos/>
    <FAQSection/>

    </div>
  );
};

export default DigitalAds;
