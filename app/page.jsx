import { Benefits } from "@/components/benefits.jsx";
import { Features } from "@/components/features.jsx";
import HeroSection from "@/components/hero.jsx";
import { MainHero } from "@/components/main-hero.jsx";
import { Pricing } from "@/components/pricing.jsx";
import { Testimonials } from "@/components/testimonials.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    
    <div>
      <MainHero/>
      <Features />
      <Benefits />
      <Testimonials />
      <Pricing />
    </div>
  );
}
