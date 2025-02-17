"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.apnasadhan.com" />
        <meta name="description" content="Apna Sadhan is a platform that provides a wide range of services to its users. We offer reliable and safe transportation services tailored to your needs." />
        <meta name="keywords" content="cab service near me, cab service near me now, cab service near me open now, cab service near me prices, cab service near me phone number, cab service near me cheap, cab service near me that take cash, cab service near me contact number, cab service near me brooklyn, cab service near me bronx, cab service in Indore, cab service in Indore to Ujjain, cab service in Indore city, cab service in Indore for outstation, cab service in Indore for full day, taxi service in Indore, taxi service in Indore outstation, taxi in Indore airport, taxi in Indore to Omkareshwar, taxi in Indore railway station, taxi rates in Indore, bike taxi in Indore, book taxi in Indore, taxi hire in Indore , Taxi in Indore, Taxi in Indore Airport, Taxi in Indore to Omkareshwar, Taxi in Indore contact number, Taxi in Indore Railway Station, Taxi Service in Indore, Taxi Service in Indore Outstation, Bike Taxi in Indore, Indore Taxi Fare, Book Taxi in Indore, Cab in Indore, Cab in Indore contact number, Cab in Indore Airport, Cab in Indore to Omkareshwar, Cabs in Indore to Ujjain, Cab Service in Indore, Car Rental Indore, Cab Service in Indore for Outstation, Cab Booking in Indore, Cab Service in Indore for Full Day, Cab Service in Indore Near Me, Cab Service in Indore Airport, Cab Service in Indore for Sightseeing, Apnasadhan Cab Service, Apnasadhan Taxi Service in Indore, Apna Sadhan Cars, Apnasadhan, Taxi in Indore, Taxi in Indore Airport, Taxi in Indore to Omkareshwar, Taxi in Indore contact number, Taxi in Indore Railway Station, Taxi Service in Indore, Taxi Service in Indore Outstation, Bike Taxi in Indore, Indore Taxi Fare, Book Taxi in Indore, Cab in Indore, Cab in Indore contact number, Cab in Indore Airport, Cab in Indore to Omkareshwar, Cabs in Indore to Ujjain, Cab Service in Indore, Car Rental Indore, Cab Service in Indore for Outstation, Cab Booking in Indore, Cab Service in Indore for Full Day, Cab Service in Indore Near Me, Cab Service in Indore Airport, Cab Service in Indore for Sightseeing, Apnasadhan Cab Service, Apnasadhan Taxi Service in Indore, Apna Sadhan Cars, Apnasadhan, Apnasadhan Taxi Indore, Apnasadhan Cab Service Indore, Apnasadhan Indore Taxi Booking, Apna Sadhan Taxi, Apnasadhan Car Hire, Apnasadhan Car Rental Indore, Apnasadhan Taxi Booking, Apnasadhan Indore Cabs, Apnasadhan Airport Taxi Indore, Apnasadhan Outstation Taxi Indore, Apnasadhan Sightseeing Taxi Indore, Apnasadhan Full Day Taxi Service, Apnasadhan Indore Taxi Contact Number, Apnasadhan Indore Car Service, 24/7 Taxi Service in Indore, Reliable Taxi Service in Indore, Affordable Taxi Service Indore, Budget Taxi Service Indore, Best Taxi Service in Indore, Fast Taxi Booking Indore, Indore Taxi for Family Trips, Indore Taxi for Business Trips, Taxi for Corporate Travel Indore, Indore Local Taxi Service, Indore City Taxi, Taxi Service Near Me in Indore, Taxi Service from Indore to Omkareshwar, Taxi Service from Indore to Ujjain, Taxi Service from Indore to Maheshwar, Indore to Mandu Taxi Service, Taxi Service from Indore to Pithampur, Taxi from Indore to Mandleshwar, Indore to Khandwa Taxi Service, Best Rated Taxi in Indore, Reliable Cab Service Indore, Affordable Cabs in Indore, Comfortable Taxi Service in Indore, Premium Taxi Service in Indore, Luxury Taxi Service Indore, Indore Taxi for Weddings, Taxi for Special Events Indore, Taxi Service with Driver in Indore, Personalized Taxi Service in Indore, Book a Taxi in Indore, Online Taxi Booking in Indore, Easy Taxi Booking in Indore, Indore Taxi Booking Number, Taxi Booking App Indore, 24/7 Taxi Booking Indore, Book a Cab in Indore, Book Taxi for Outstation Indore, Indore Taxi Booking Service, Book Taxi for Sightseeing Indore" />
        <meta name="author" content="Apna Sadhan" />
        <meta name="robots" content="index, follow " />
        <link rel="canonical" href="https://www.apnasadhan.com" />
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
