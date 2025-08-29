import { Benefits } from "@/components/benefits";
import { Features } from "@/components/features";
import HeroSection from "@/components/hero";
import { MainHero } from "@/components/main-hero";
import { Pricing } from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";
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
