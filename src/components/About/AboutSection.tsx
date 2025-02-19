"use client";
import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";
import { Typewriter } from 'react-simple-typewriter';

// Dynamically import react-slick with no SSR
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutSection = () => {
  const List = ({ text }) => (
    <p className="mb-5 flex items-center text-lg font-medium text-body-color transition-transform duration-300 hover:scale-105">
      <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  const carouselSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <section id="about" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container mx-auto px-4">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2  flex justify-center items-center flex-col">
              <SectionTitle
                title="About ApnaSadhan"
                mb="16px"
              />

              <div
                className="mb-12 max-w-[570px] lg:mb-0"
                data-wow-delay=".15s"
              >
                <p className="mb-8 text-base leading-relaxed text-body-color">
                  Welcome to{" "}
                  <span className="font-bold !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-700">
                    ApnaSadhan
                  </span>{" "}
                  – your trusted cab service for smooth, safe, and affordable
                  travel! Whether it&apos;s a quick local ride, an outstation
                  trip, or an airport transfer, we ensure clean cars, expert
                  drivers, and pocket-friendly fares. We may be new, but we&apos;re
                  here to make every journey a happy ride with top-notch service
                  and unbeatable prices. Book now and ride smarter with ApnaSadhan!
                </p>
                <div className="mx-[-12px] flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="Affordable price" />
                    <List text="Safety & Comfort" />
                    <List text="24/7 Availability" />
                  </div>

                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="Punctuality" />
                    <List text="Experienced Drivers" />
                    <List text="Reliability" />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2 flex justify-center items-center">
              <div className="relative mx-auto aspect-[25/24] max-w-full lg:mr-0">
                <Slider {...carouselSettings}>
                  <div className="relative">
                    <Image
                      src="/images/about/selfi.jpg"
                      alt="Carousel Image 1"
                      layout="responsive"
                      width={500}
                      height={500}
                      className="rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="relative">
                    <Image
                      src="/images/about/twogirls.jpg"
                      alt="Carousel Image 2"
                      layout="responsive"
                      width={500}
                      height={500}
                      className="rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="relative">
                    <Image
                      src="/images/about/freinds.avif"
                      alt="Carousel Image 3"
                      layout="responsive"
                      width={500}
                      height={500}
                      className="rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </Slider>

                <div className="typewriter-container mt-6 p-4 rounded-lg shadow-lg text-lg md:text-xl font-medium bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-600 dark:to-green-600 bg-clip-text text-transparent min-h-36 md:min-h-24 flex items-center justify-center">
                  <Typewriter
                    words={[
                      'Chalo kahin door, jahaan ho sukoon bharpur! 🌍🚖',
                      "Booking ho easy, ride ho breezy! 📲💨",
                      "Indore ho ya outstation, bas ek call pe destination! 📞🛤️",
                      "Gaadi ho smooth, safar ho cool! 🚗❄️",
                      "Raste ho lambe ya chhote, hum hamesha ready hote! 😎🚖",
                      "Ride ho mast, no time waste! ⏳🚖",
                      "Garmi ho ya thandi, ride milegi badi hi comfy! ❄️🔥🚗",
                      "Safar ho light, feel ho bright! ✨🛣️",
                      "Booking ho fast, ride ho first-class! 🏆🚘",
                      "Meter ho right, ride ho tight! 🔥📏",
                      "Gaadi ho clean, ride lage dream! 💫🚗",
                      "Traffic ho ya jam, hum rehte fir bhi calm! 🚦😎",
                      "No stress, no fuss, sirf smooth ride ka plus! 🛣️✅",
                      "Chalo aaram se, bina kisi jhanjhat ke! 🚗💨",
                      "Ek call pe ride, tension-free guide! 📞🚖",
                      "Chinta ko bolo bye, ride ho super fly! ✈️🚖",
                      "No delay, no bore, bas smooth ride hardcore! 🚗🔥",
                      "Gaadi ho classy, ride ho sassy! 😎🚘",
                      "Meter chale fair, ride ho super rare! 🎯🚖",
                      "No rush, no race, bas ride ka smooth grace! 🛣️✨",
                      "Booking ho quick, ride ho slick! 📲🚗",
                      "Driver ho nice, ride ho full spice! 🔥🚖",
                      "Muskuraiye aur chaliye, ride ho badiya bhaiyye! 😃🚘",
                      "Subah ho ya raat, ride ho ekdum shaandaar baat! 🌙🌞🚗",
                      "Safety ka promise, comfort ka bonus! ✅🚖"
                    ]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={50}
                    deleteSpeed={10}
                    delaySpeed={3000}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
