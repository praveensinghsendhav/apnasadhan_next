'use client';

import React from 'react';
import Slider from "react-slick";
import { TeamCard } from './TeamCard';
import SectionTitle from '../Common/SectionTitle';
import tourPackages from '@/data/tourpackages.json';

export default function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Split packages into two rows for large screens
  const firstRow = tourPackages.slice(0, 4);
  const secondRow = tourPackages.slice(4, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionTitle
            title="Our Tour Packages"
            center
          />
        </div>
        
        {/* Mobile Layout - Single Row */}
        <div className="block lg:hidden mt-8">
          <Slider {...settings} className="slick-slider">
            {tourPackages.map((member, index) => (
              <div key={index} className="px-2">
                <TeamCard
                  imageUrl={member.imageUrl}
                  name={member.name}
                  city={member.city}
                  social={member.social}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Desktop Layout - Two Rows */}
        <div className="hidden lg:block space-y-8">
          {/* First Row */}
          <div className="mt-8">
            <Slider {...settings} className="slick-slider">
              {firstRow.map((member, index) => (
                <div key={index} className="px-2">
                  <TeamCard
                    imageUrl={member.imageUrl}
                    name={member.name}
                    city={member.city}
                    social={member.social}
                  />
                </div>
              ))}
            </Slider>
          </div>
          
          {/* Second Row */}
          <div className="mt-8">
            <Slider {...settings} className="slick-slider">
              {secondRow.map((member, index) => (
                <div key={index + 4} className="px-2">
                  <TeamCard
                    imageUrl={member.imageUrl}
                    name={member.name}
                    city={member.city}
                    social={member.social}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}