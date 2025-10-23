"use client";

import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "react-modal-video/css/modal-video.css";
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
        <meta
          name="description"
          content="Looking for a reliable ride? 🚗 Apna Sadhan offers 24x7 ✓Cab Services, ✓Car Rentals, ✓Outstation Cabs, ✓Airport Transfers, ✓Tempo Travellers, and ✓Verified Travel Agents in Indore. Safe rides, on-time pickups, and unbeatable prices. Book now & ride worry-free!"
        />
        <meta
          name="keywords"
          content="cab service near me, cab service in Indore, taxi service in Indore, Apnasadhan Taxi Indore, car rental Indore, airport taxi Indore, outstation taxi Indore"
        />
        <meta name="author" content="Apna Sadhan" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "Apnasadhan",
              "image": "https://apnasadhan.com/images/logo/as_logo.png",
              "url": "https://apnasadhan.com",
              "telephone": "7225955494",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Manglia",
                "addressLocality": "Indore",
                "postalCode": "453771",
                "addressCountry": "IN",
              },
              "sameAs": [
                "https://www.facebook.com/people/Apnasadhan/61559018083173/",
                "https://www.instagram.com/apnasadhan",
              ],
            }),
          }}
        />
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
