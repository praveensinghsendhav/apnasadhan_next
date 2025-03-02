import { Testimonial } from "@/types/testimonial";
import Image from "next/image";
import { useState } from "react";

const starIcon = (
  <svg width="18" height="16" viewBox="0 0 18 16" className="fill-current text-yellow">
    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
  </svg>
);

const SingleTestimonial = ({ testimonial }: { testimonial: Testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { star, name, image, content, designation } = testimonial;
  const maxContentLength = 100; // Set the maximum number of characters before truncating

  const toggleReadMore = () => {
    setIsExpanded(prevState => !prevState);
  };

  const ratingIcons = Array.from({ length: star }, (_, index) => (
    <span key={index}>
      {starIcon}
    </span>
  ));

  return (
    <div className="w-full h-[300px] bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-1 mb-4">{ratingIcons}</div>
          <div className={`text-base text-justify leading-relaxed text-gray-700 dark:text-gray-300 ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`} style={{ maxHeight: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            “{isExpanded ? content : `${content.substring(0, maxContentLength)}...`}
            {!isExpanded && content.length > maxContentLength && (
              <span className="text-blue-500 dark:text-blue-400 cursor-pointer" onClick={toggleReadMore}> Read More</span>
            )}
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="relative mr-4 h-[50px] w-[50px] overflow-hidden rounded-full border-2 border-blue-500 dark:border-blue-400">
            <Image src={image} alt={name} fill />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{designation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestimonial;
