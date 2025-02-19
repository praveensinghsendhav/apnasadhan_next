'use client';

import { TeamCard } from './TeamCard';
import SectionTitle from '../Common/SectionTitle';

export default function Home() {
  const teamMembers = [
    {
      imageUrl: '/images/packages/maheshwar.jpg',
      name: 'Maheshwar',
      city: 'Khargone District',
      social: {
        instagram: 'https://www.instagram.com/apnasadhan'
      }
    },
    {
      imageUrl: '/images/packages/mandu.jpg',
      name: 'Mandav',
      city: 'Dhar District',
      social: {
        instagram: 'https://www.instagram.com/apnasadhan'
      }
    },
    {
      imageUrl: '/images/packages/omkar.jpg',
      name: 'Omkareshwar',
      city: 'Khandwa District',
      social: {
        instagram: 'https://www.instagram.com/apnasadhan'
      }
    },
    {
      imageUrl: '/images/packages/ujjain.jpg',
      name: 'Ujjain',
      city: 'Ujjain District',
      social: {
        instagram: 'https://www.instagram.com/apnasadhan'
      }
    },
    {
      imageUrl: '/images/packages/sawraji.jpg',
      name: 'Sawariya Seth',
      city: 'Chittorgarh District',
      social: {
        instagram: 'https://www.instagram.com/apnasadhan'
      }
    },
    {
      imageUrl: '/images/packages/jaipur.jpg',
      name: 'Jaipur',
      city: 'Jaipur City',
      social: {
        instagram: 'https://www.instagram.com/apnasadhan'
      }
    },
    {
      imageUrl: '/images/packages/ayodhya.jpg',
      name: 'Ayodhya',
      city: 'Ayodhya City',
      social: {
        instagram: 'https://www.instagram.com/apnasadhan'
      }
    },
    {
      imageUrl: '/images/packages/triambakeshwar.jpg',
      name: 'Triambakeshwar',
      city: 'Nashik District',
      social: {
        instagram: 'https://www.instagram.com/apnasadhan'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionTitle
            title="Our Tour Packages"
            center
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard
              key={index}
              imageUrl={member.imageUrl}
              name={member.name}
              city={member.city}
              social={member.social}
            />
          ))}
        </div>
      </div>
    </div>
  );
}