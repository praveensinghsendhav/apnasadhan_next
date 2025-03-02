"use client";

import React from 'react';
import Slider from "react-slick";
import { Car, CarCard } from "./car-card";
import { Container } from "./container";
import SectionTitle from '../Common/SectionTitle';
import cars from '@/data/cars.json';

export default function OurCabs() {
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

  return (
    <Container>
      <div className="py-12">
        <SectionTitle
          title="Our Cabs"
          center
        />
        <div className="mt-8">
          <Slider {...settings} className="slick-slider">
            {cars.map((car) => (
              <div key={car.id} className="px-2">
                <CarCard car={car} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </Container>
  );
}