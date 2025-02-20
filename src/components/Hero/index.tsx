"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { Typewriter } from 'react-simple-typewriter';

// Dynamically import react-slick with no SSR
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const Hero = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
    cssEase: "ease-in-out"
  };

  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
      >
        <div className="container flex flex-wrap">
          <div className="w-full md:w-1/2 px-4">
            <div className="mx-auto max-w-[800px] text-center md:text-left flex justify-center items-center md:items-start flex-col">
              <h1 className="text-3xl md:text-5xl font-extrabold font-sans text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-[#06ab0b] flex items-center justify-center md:justify-start -mr-10 md:mr-0">
                APNA SADHAN
                {/* <Typewriter
                  words={['APNA SADHAN']}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={5000}
                /> */}
                <Image
                  src="/images/logo/pankh.png"
                  alt="Icon"
                  width={70}
                  height={70}
                  className="pb-4 ml-[-10px]"
                />
              </h1>
              <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                Arrive in Style, Depart with a Smile: Your Cab, Your Comfort!
              </p>
              <div className="typewriter-container mt-6 p-4 rounded-lg bg-gradient-to-r from-[#092f98] to-[#06ab0b] shadow-lg text-lg md:text-xl font-medium dark:from-blue-600 dark:to-green-600 bg-clip-text text-transparent min-h-36 md:min-h-24 flex items-center justify-center w-full">
                <Typewriter
                  words={[
                    'Shaadi ho ya sagai, gaadi ki chinta mitai! Baraat le jaaye ya doli, hum ready hain! 💒🚖',
                    'Business meeting ke liye punctual ride chahiye? No delays, sirf smooth travel! ⏳🚗',
                    'Team outing ya corporate trip? Tension free travel, boss! 🏢🚘',
                    'Mandir darshan ka plan hai? Omkareshwar, Mahakaleshwar ya Maheshwar, bas batao! 🙏🚖',
                    'Apni family ke saath ghoomne ka mood hai? Safe aur comfortable ride guaranteed! 👨‍👩‍👧‍👦🚗',
                    'Indore ki galiyon ka maza lena hai? Chalo, ghumate hain! 🏙️🚖',
                    'Shopping spree pe nikalna hai? Bags bhar lo, ride hum dekh lenge! 🛍️🚘',
                    'Airport, railway station ya bus stand drop-off? Time ka tension mat lo, hum hain na! 🕒✈️🚖',
                    'Late night safe ride chahiye? Ek call karo, hum available hain! 🌙📞🚖',
                    'Weekend trip ka plan hai? Goa ho ya Manali, bas destination batao! 🏔️🏝️🚗',
                    'Medical emergency ya urgent travel? Sabse tez aur reliable service! 🚑🚖',
                    'College ya coaching ke liye daily ride chahiye? Roz ka jaane ka tension khatam! 🎓🚗',
                    'Bike ride nahi, aaj aram se travel karna hai? Chalo, humari cab le lo! 🛺🚖',
                    'Special date night hai? Luxury ride ke saath entry grand honi chahiye! 💑🚘'
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
            <div className="mt-6 flex justify-center  md:justify-start mx-auto w-full">
              <Link
                href="https://wa.me/7000609982?text=Hi%2C%20I%20want%20to%20book%20a%20cab%20on%20[Enter%20Date]%20at%20[Enter%20Time].%20Pickup%20from%20[Location]%20to%20[Location].%20Please%20confirm%20availability.
"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-green-500  hover:from-blue-600 hover:to-green-600 transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4 h-full sm:mt-8 md:mt-4 mt-16">
            <Slider {...settings}>
              <div>
                <Image
                  src="/images/corosol/ertiga.png"
                  alt="Image 1"
                  className="w-full object-cover object-center"
                  width={800}
                  height={600}
                />
              </div>
              <div>
                <Image
                  src="/images/corosol/innovawhite.png"
                  alt="Image 2"
                  className="w-full object-cover object-center"
                  width={800}
                  height={600}
                />
              </div>
              <div>
                <Image
                  src="/images/corosol/hondacity.png"
                  alt="Image 3"
                  className="w-full object-cover object-center"
                  width={800}
                  height={600}
                />
              </div>
              <div>
                <Image
                  src="/images/corosol/carens.png"
                  alt="Image 4"
                  className="w-full object-cover object-center"
                  width={800}
                  height={600}
                />
              </div>
            </Slider>
          </div>
        </div>
        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="277"
              cy="63"
              r="225"
              fill="url(#paint0_linear_25:217)"
            />
            <circle
              cx="17.9997"
              cy="182"
              r="18"
              fill="url(#paint1_radial_25:217)"
            />
            <circle
              cx="76.9997"
              cy="288"
              r="34"
              fill="url(#paint2_radial_25:217)"
            />
            <circle
              cx="325.486"
              cy="302.87"
              r="180"
              transform="rotate(-37.6852 325.486 302.87)"
              fill="url(#paint3_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="184.521"
              cy="315.521"
              r="132.862"
              transform="rotate(114.874 184.521 315.521)"
              stroke="url(#paint4_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="356"
              cy="290"
              r="179.5"
              transform="rotate(-30 356 290)"
              stroke="url(#paint5_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="191.659"
              cy="302.659"
              r="133.362"
              transform="rotate(133.319 191.659 302.659)"
              fill="url(#paint6_linear_25:217)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_25:217"
                x1="-54.5003"
                y1="-178"
                x2="222"
                y2="288"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" />
                <stop offset="1" stopColor="#092f98" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint1_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
              >
                <stop offset="0.145833" stopColor="#092f98" stopOpacity="0" />
                <stop offset="1" stopColor="#092f98" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
              >
                <stop offset="0.145833" stopColor="#092f98" stopOpacity="0" />
                <stop offset="1" stopColor="#092f98" stopOpacity="0.08" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_25:217"
                x1="226.775"
                y1="-66.1548"
                x2="292.157"
                y2="351.421"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" />
                <stop offset="1" stopColor="#092f98" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:217"
                x1="184.521"
                y1="182.159"
                x2="184.521"
                y2="448.882"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_25:217"
                x1="356"
                y1="110"
                x2="356"
                y2="470"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_25:217"
                x1="118.524"
                y1="29.2497"
                x2="166.965"
                y2="338.63"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" />
                <stop offset="1" stopColor="#092f98" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <path
              d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
              stroke="url(#paint1_linear_25:218)"
            />
            <path
              d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
              stroke="url(#paint2_linear_25:218)"
            />
            <path
              d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
              stroke="url(#paint3_linear_25:218)"
            />
            <circle
              opacity="0.8"
              cx="214.505"
              cy="60.5054"
              r="49.7205"
              transform="rotate(-13.421 214.505 60.5054)"
              stroke="url(#paint4_linear_25:218)"
            />
            <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="184.389"
                y1="69.2405"
                x2="184.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" stopOpacity="0" />
                <stop offset="1" stopColor="#092f98" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_25:218"
                x1="156.389"
                y1="69.2405"
                x2="156.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" stopOpacity="0" />
                <stop offset="1" stopColor="#092f98" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_25:218"
                x1="125.389"
                y1="69.2405"
                x2="125.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" stopOpacity="0" />
                <stop offset="1" stopColor="#092f98" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_25:218"
                x1="93.8507"
                y1="67.2674"
                x2="89.9278"
                y2="210.214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" stopOpacity="0" />
                <stop offset="1" stopColor="#092f98" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:218"
                x1="214.505"
                y1="10.2849"
                x2="212.684"
                y2="99.5816"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#092f98" />
                <stop offset="1" stopColor="#092f98" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_25:218"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(220 63) rotate(90) scale(43)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;
