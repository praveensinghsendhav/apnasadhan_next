'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Instagram } from 'lucide-react';
import Link from 'next/link';

interface TeamCardProps {
  imageUrl: string;
  name: string;
  city: string;
  social?: {
    instagram?: string;
  };
}

export function TeamCard({ imageUrl, name, city, social }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl">
        <div className="relative h-80 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full"
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          initial={false}
        >
          <h3 className="text-2xl font-bold mb-1">{name}</h3>
          <p className="text-gray-200 mb-4">{city}</p>

          <div className="flex gap-4">
            {social?.instagram && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-400 transition-colors"
              >
                <Instagram size={40} />
              </motion.a>
            )}
            <Link
              href="https://wa.me/7000609982?text=%F0%9F%9A%96%20*Cab%20Booking%20Request*%0A%0A%F0%9F%91%A4%20*Name:*%20[Enter%20Name]%0A%F0%9F%93%8D%20*Pickup%20Location:*%20[Enter%20Location]%0A%F0%9F%93%8D%20*Drop%20Location:*%20[Enter%20Location]%0A%F0%9F%93%85%20*Date:*%20[Enter%20Date]%0A%E2%8F%B0%20*Time:*%20[Enter%20Time]%0A%F0%9F%9A%98%20*Cab%20Type:*%20[Hatchback/Sedan/SUV]%0A%0A%F0%9F%99%8F%20Please%20confirm%20availability!.
"
              target="_blank"
              rel="noopener noreferrer" className=" px-4 py-2 text-white rounded-md border border-white bg-gradient-to-r from-blue-500 to-green-500 opacity-80 hover:bg-gradient-to-r hover:from-blue-700 hover:to-green-700 hover:text-white transition-colors cursor-pointer">Book Now</Link>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}