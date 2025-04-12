import AboutSection from "@/components/About/AboutSection";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import WhyChooseUs from "@/components/WhyChooseUs";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import { Metadata } from "next";
import Head from "next/head";
import Packages from "@/components/Packages";
import OurCabs from "@/components/OurCabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata: Metadata = {
  title: "Apna Sadhan -  Indore's Most Trusted Cab & Travel Partner",
  description: "Looking for a reliable ride? 🚗 Apna Sadhan offers 24x7 ✓Cab Services, ✓Car Rentals, ✓Outstation Cabs, ✓Airport Transfers, ✓Tempo Travellers, and ✓Verified Travel Agents in Indore. Safe rides, on-time pickups, and unbeatable prices. Book now & ride worry-free!",
  keywords: "cab service near me, cab service near me now, cab service near me open now, cab service near me prices, cab service near me phone number, cab service near me cheap, cab service near me that take cash, cab service near me contact number, cab service near me brooklyn, cab service near me bronx, cab service in Indore, cab service in Indore to Ujjain, cab service in Indore city, cab service in Indore for outstation, cab service in Indore for full day, taxi service in Indore, taxi service in Indore outstation, taxi in Indore airport, taxi in Indore to Omkareshwar, taxi in Indore railway station, taxi rates in Indore, bike taxi in Indore, book taxi in Indore, taxi hire in Indore , Taxi in Indore, Taxi in Indore Airport, Taxi in Indore to Omkareshwar, Taxi in Indore contact number, Taxi in Indore Railway Station, Taxi Service in Indore, Taxi Service in Indore Outstation, Bike Taxi in Indore, Indore Taxi Fare, Book Taxi in Indore, Cab in Indore, Cab in Indore contact number, Cab in Indore Airport, Cab in Indore to Omkareshwar, Cabs in Indore to Ujjain, Cab Service in Indore, Car Rental Indore, Cab Service in Indore for Outstation, Cab Booking in Indore, Cab Service in Indore for Full Day, Cab Service in Indore Near Me, Cab Service in Indore Airport, Cab Service in Indore for Sightseeing, Apnasadhan Cab Service, Apnasadhan Taxi Service in Indore, Apna Sadhan Cars, Apnasadhan, Taxi in Indore, Taxi in Indore Airport, Taxi in Indore to Omkareshwar, Taxi in Indore contact number, Taxi in Indore Railway Station, Taxi Service in Indore, Taxi Service in Indore Outstation, Bike Taxi in Indore, Indore Taxi Fare, Book Taxi in Indore, Cab in Indore, Cab in Indore contact number, Cab in Indore Airport, Cab in Indore to Omkareshwar, Cabs in Indore to Ujjain, Cab Service in Indore, Car Rental Indore, Cab Service in Indore for Outstation, Cab Booking in Indore, Cab Service in Indore for Full Day, Cab Service in Indore Near Me, Cab Service in Indore Airport, Cab Service in Indore for Sightseeing, Apnasadhan Cab Service, Apnasadhan Taxi Service in Indore, Apna Sadhan Cars, Apnasadhan, Apnasadhan Taxi Indore, Apnasadhan Cab Service Indore, Apnasadhan Indore Taxi Booking, Apna Sadhan Taxi, Apnasadhan Car Hire, Apnasadhan Car Rental Indore, Apnasadhan Taxi Booking, Apnasadhan Indore Cabs, Apnasadhan Airport Taxi Indore, Apnasadhan Outstation Taxi Indore, Apnasadhan Sightseeing Taxi Indore, Apnasadhan Full Day Taxi Service, Apnasadhan Indore Taxi Contact Number, Apnasadhan Indore Car Service, 24/7 Taxi Service in Indore, Reliable Taxi Service in Indore, Affordable Taxi Service Indore, Budget Taxi Service Indore, Best Taxi Service in Indore, Fast Taxi Booking Indore, Indore Taxi for Family Trips, Indore Taxi for Business Trips, Taxi for Corporate Travel Indore, Indore Local Taxi Service, Indore City Taxi, Taxi Service Near Me in Indore, Taxi Service from Indore to Omkareshwar, Taxi Service from Indore to Ujjain, Taxi Service from Indore to Maheshwar, Indore to Mandu Taxi Service, Taxi Service from Indore to Pithampur, Taxi from Indore to Mandleshwar, Indore to Khandwa Taxi Service, Best Rated Taxi in Indore, Reliable Cab Service Indore, Affordable Cabs in Indore, Comfortable Taxi Service in Indore, Premium Taxi Service in Indore, Luxury Taxi Service Indore, Indore Taxi for Weddings, Taxi for Special Events Indore, Taxi Service with Driver in Indore, Personalized Taxi Service in Indore, Book a Taxi in Indore, Online Taxi Booking in Indore, Easy Taxi Booking in Indore, Indore Taxi Booking Number, Taxi Booking App Indore, 24/7 Taxi Booking Indore, Book a Cab in Indore, Book Taxi for Outstation Indore, Indore Taxi Booking Service, Book Taxi for Sightseeing Indore",
  openGraph: {
    title: "Apna Sadhan -  Indore's Most Trusted Cab & Travel Partner",
    description: "Looking for a reliable ride? 🚗 Apna Sadhan offers 24x7 ✓Cab Services, ✓Car Rentals, ✓Outstation Cabs, ✓Airport Transfers, ✓Tempo Travellers, and ✓Verified Travel Agents in Indore. Safe rides, on-time pickups, and unbeatable prices. Book now & ride worry-free!",
    url: "https://www.apnasadhan.com",
    type: "website",
    images: [
      {
        url: "/logo/as_logo.png",
        width: 800,
        height: 600,
        alt: "Apna Sadhan Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@apnasadhan",
    title: "Apna Sadhan - Your Trusted Ride Partner",
    description: "Looking for a reliable ride? 🚗 Apna Sadhan offers 24x7 ✓Cab Services, ✓Car Rentals, ✓Outstation Cabs, ✓Airport Transfers, ✓Tempo Travellers, and ✓Verified Travel Agents in Indore. Safe rides, on-time pickups, and unbeatable prices. Book now & ride worry-free!",
    images: ["/logo/as_logo.png"],
  }
};

export default function Home() {
  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TaxiService",
            "name": "Apnasadhan Taxi Service",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Indore",
              "addressCountry": "IN",
              "addressRegion": "MP",
              "postalCode": "453771"
            },
            "areaServed": {
              "@type": "City",
              "name": "Indore"
            },
            "url": "https://www.apnasadhan.com",
            "logo": "/logo/as_logo.png",
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61559018083173",
              "https://www.instagram.com/apnasadhan",
              "https://www.youtube.com/@apnasadhan"
            ],
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+91 9827217315",
                "contactType": "Mobile",
                "email": "apnasadhan2002@gmail.com",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              },
              {
                "@type": "ContactPoint",
                "telephone": "+91 7225955494",
                "contactType": "Phone",
                "email": "apnasadhan2002@gmail.com",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              }
            ]
          })}
        </script>
      </Head>
      <Header />
      <ScrollUp />
      <Hero />
      <Packages />
      <OurCabs />
      <WhyChooseUs />
      <AboutSection />
      <Testimonials />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  );
}
