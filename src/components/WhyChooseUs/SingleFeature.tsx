import { Feature } from "@/types/feature";
import Image from "next/image";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph } = feature;

  return (
    <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-[90px] w-[90px] items-center justify-center rounded-2xl bg-white dark:bg-gray-900 dark:bg-gradient-to-r from-blue-400/10 to-green-400/10 text-gray-800 dark:text-white shadow-lg dark:shadow-xl transition-transform duration-300 ease-in-out hover:scale-110">
          <Image src={icon} alt={title} width={55} height={55} />
        </div>
        <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white tracking-wide">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-md">
          {paragraph}
        </p>
      </div>
    </div>
  );
};

export default SingleFeature;