import type { StaticImageData } from "next/image";
export type Feature = {
  id: number;
  icon: StaticImageData;
  title: string;
  paragraph: string;
};
