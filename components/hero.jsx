"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  const imageRef = useRef();
  const lastScrollY = useRef(0); // store last scroll position

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        // scrolling down → image normal
        imageElement.classList.remove("tilted");
      } else {
        // scrolling up → tilt back
        imageElement.classList.add("tilted");
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pb-30 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl lg:text-[80px] pb-g gradient-title">
          Where smart thinking <br /> meets smart spending.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-driven platform that empowers you to track, understand,
          and optimize your spending in real time for smarter financial decisions.
        </p>

        {/* Buttons side-by-side */}
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="">
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* Banner Image */}
        <div className="hero-image-wrapper">
          <Image
            ref={imageRef}
            src="/banner.jpeg"
            width={960} // reduced from 1280
            height={540} // keeps 16:9 aspect ratio
            alt="Dashboard Preview"
            className="hero-image rounded-lg shadow-2xl border mx-auto max-w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
