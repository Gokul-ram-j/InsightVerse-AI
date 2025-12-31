"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export default function Home() {
  const [showBrand, setShowBrand] = useState(false);

  // Auto swap every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBrand((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black relative">
      {/* App Name – Top Left */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50
        text-md md:text-1xl font-semibold tracking-wide
        bg-[linear-gradient(to_right,red,orange,yellow,green)]
        bg-[length:200%_100%] bg-left
        bg-clip-text text-transparent
        transition-all duration-500
        hover:bg-right hover:drop-shadow-[0_0_12px_rgba(255,165,0,0.5)]"
      >
        InsightVerse AI
      </Link>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* HERO HEADING (Auto Swap) */}
          <div className="relative mb-6">
            {/* Brand Text */}
            <h1
              className={`absolute inset-0 flex items-center justify-center
              text-4xl md:text-6xl font-bold text-center
              leading-relaxed md:leading-snug
              px-4 py-6
              bg-[linear-gradient(to_right,red,orange,yellow,green)]
              bg-clip-text text-transparent
              transition-all duration-1000 ease-in-out
              ${showBrand ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
              Making learning faster, deeper, and intelligently personalized
            </h1>

            {/* Context Text */}
            <h2
              className={`text-5xl md:text-7xl font-bold
              bg-[linear-gradient(to_right,red,orange,yellow,green)]
              py-5 bg-clip-text text-transparent drop-shadow-lg
              transition-all duration-1000 ease-in-out
              ${showBrand ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
            >
              <span className="block">The next generation of</span>
              <span className="block">learning—human-led,</span>
              <span className="block">AI-powered</span>
            </h2>
          </div>

          {/* SUB DESCRIPTION (ALWAYS VISIBLE) */}
          <p
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto
            leading-relaxed mb-8"
          >
            One platform to analyze content and generate quizzes using AI.
            <br />
            Built for creators, educators, and teams who value speed and
            quality.
          </p>

          {/* CTA (ALWAYS VISIBLE) */}
          <Link href="/upload">
            <button
              className="px-8 py-4 text-lg font-semibold rounded-full
              bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400
              text-black hover:scale-105 transition-transform duration-300
              shadow-lg"
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Services */}
      <Services />

      {/* Footer */}
      <Footer />
    </main>
  );
}
