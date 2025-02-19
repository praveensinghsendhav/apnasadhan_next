"use client";

import { Car, CarCard } from "./car-card";
import { Container } from "./container";
import SectionTitle from '../Common/SectionTitle';

const cars: Car[] = [
  {
    id: 1,
    name: "ERTIGA",
    image: "/images/our-cabs/ertiga.png",
    capacity: "6 + Driver",
    luggage: "2small",
    musicPlayer: true,
    ac: true,
  },
  {
    id: 2,
    name: "KIA",
    image: "/images/our-cabs/carens.png",
    capacity: "6 + Driver",
    luggage: "2small",
    musicPlayer: true,
    ac: true,
  },
  {
    id: 3,
    name: "INNOVA CRYSTA",
    image: "/images/our-cabs/innovablack.png",
    capacity: "6/7 + Driver",
    luggage: "2small",
    musicPlayer: true,
    ac: true,
  },
  {
    id: 4,
    name: "SEDAN",
    image: "/images/our-cabs/hondacity.png",
    capacity: "4 + Driver",
    luggage: "2small",
    musicPlayer: true,
    ac: true,
  },
];

export default function OurCabs() {
  return (
    <Container>
      <div className="py-12">
        <SectionTitle
          title="Our Cabs"
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </Container>
  );
}