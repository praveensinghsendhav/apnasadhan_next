import AboutSection from "@/components/About/AboutSection";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import WhyChooseUs from "@/components/WhyChooseUs";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Next.js Template for Startup and SaaS",
  description: "This is Home for Startup Nextjs Template",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <WhyChooseUs />
      <AboutSection />
      <Testimonials />
      <Contact />
    </>
  );
}
