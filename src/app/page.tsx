import AboutSection from "@/components/About/AboutSection";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import WhyChooseUs from "@/components/WhyChooseUs";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apna Sadhan",
  description: "Welcome to ApnaSadhan – Your Trusted Ride Partner!",
  keywords: "ride, transport, trusted partner, Apna Sadhan",
  openGraph: {
    title: "Apna Sadhan",
    description: "Welcome to ApnaSadhan – Your Trusted Ride Partner!",
    url: "https://apnasadhaa.vercel.app",
    type: "website",
    images: [
      {
        url: "https://apnasadhaa.vercel.app/public/logo/as_logo.png",
        width: 800,
        height: 600,
        alt: "Apna Sadhan",
      },
    ],
  }
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
