import React from 'react';
import Image from 'next/image';
import SectionTitle from '../Common/SectionTitle';

const GetInTouch = () => {
  return (
    <section
      id="get-in-touch"
      className="relative z-10 overflow-hidden flex justify-center items-center"
    >
      <div className="container mx-auto flex items-center justify-center h-full ">
        <div className="py-8  text-center w-full flex flex-col items-center">
          <SectionTitle title="Get In Touch" center={true} mb="10px" />
          <div className="flex flex-col md:flex-row justify-center w-full px-4">
            <div className="flex flex-col gap-3 text-white md:flex-row justify-center items-center md:items-center">
              <p className="flex items-center gap-2 text-lg text-gray-500 dark:text-white">
                <Image src="/images/contact/phone.png" alt="Phone Icon" width={20} height={20} />
                <a href="tel:+919827217315" className="hover:underline">+91 9827217315</a>
              </p>
              <p className="flex items-center gap-2 text-lg text-gray-500 dark:text-white">
                <a href="tel:+917225955494" className="hover:underline">+91 7225955494</a>
              </p>
              <p className="flex items-center gap-2 text-lg text-gray-500 dark:text-white">
                <Image src="/images/contact/mail.png" alt="Email Icon" width={20} height={20} />
                <a href="mailto:apnasadhan2002@gmail.com" className="hover:underline">apnasadhan2002@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
