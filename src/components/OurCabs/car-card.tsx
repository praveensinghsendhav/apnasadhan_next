"use client";

import { Check, Music, Snowflake, CarTaxiFront, Briefcase, Users } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../Packages/Card";
import Link from "next/link";

export interface Car {
  id: number;
  name: string;
  image: string;
  capacity: string;
  luggage: string;
  musicPlayer: boolean;
  ac: boolean;
}

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={car.image}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="bg-yellow-400 rounded-full p-4 shadow-lg opacity-80 bg-gradient-to-r from-blue-700 to-green-700 dark:bg-gradient-to-r dark:from-blue-700/50 dark:to-green-700/50">
              <div className="w-8 h-8 flex items-center justify-center ">
                <CarTaxiFront className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mt-6 mb-4">{car.name}</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-yellow-500 text-blue-700" />
              <span>Capacity:</span>
            </div>
            <span>{car.capacity}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-yellow-500 text-blue-700" />
              <span>Luggage:</span>
            </div>
            <span>{car.luggage}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-yellow-500 text-blue-700" />
              <span>Music Player:</span>
            </div>
            <Check className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Snowflake className="w-4 h-4 text-yellow-500 text-blue-700" />
              <span>AC:</span>
            </div>
            <Check className="w-4 h-4 text-green-500 " />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href="https://wa.me/7000609982?text=%F0%9F%9A%96%20*Cab%20Booking%20Request*%0A%0A%F0%9F%91%A4%20*Name:*%20[Enter%20Name]%0A%F0%9F%93%8D%20*Pickup%20Location:*%20[Enter%20Location]%0A%F0%9F%93%8D%20*Drop%20Location:*%20[Enter%20Location]%0A%F0%9F%93%85%20*Date:*%20[Enter%20Date]%0A%E2%8F%B0%20*Time:*%20[Enter%20Time]%0A%F0%9F%9A%98%20*Cab%20Type:*%20[Hatchback/Sedan/SUV]%0A%0A%F0%9F%99%8F%20Please%20confirm%20availability!.
"
          target="_blank"
          rel="noopener noreferrer" className=" px-4 py-2 text-white rounded-md border border-white bg-gradient-to-r from-blue-500 to-green-500 opacity-80 hover:bg-gradient-to-r hover:from-blue-700 hover:to-green-700 hover:text-white transition-colors cursor-pointer w-full text-center">Book Now</Link>
      </CardFooter>
    </Card>
  );
}