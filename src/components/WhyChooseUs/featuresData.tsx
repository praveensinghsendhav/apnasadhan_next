import { Feature } from "@/types/feature";
import reliable from "../../../public/images/whyChooseUs/reliable.png";
import lowestPrice from "../../../public/images/whyChooseUs/lowestPrice.png";
import bestCar from "../../../public/images/whyChooseUs/bestCar.png";
import easyToBook from "../../../public/images/whyChooseUs/easyToBook.png";
import wellMaintainedCars from "../../../public/images/whyChooseUs/wellMaintainedCars.png";
import convenient from "../../../public/images/whyChooseUs/convenient.png";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: reliable,
    title: "Reliable Service",
    paragraph: "We ensure timely pickups and drop-offs with professional drivers.",
  },
  {
    id: 2,
    icon: lowestPrice,
    title: "Lowest Price",
    paragraph: "Get the best rates for your rides without compromising on quality.",
  },
  {
    id: 3,
    icon: bestCar,
    title: "Best Cars",
    paragraph: "Choose from a fleet of top-quality vehicles for a comfortable journey.",
  },
  {
    id: 4,
    icon: easyToBook,
    title: "Easy to Book",
    paragraph: "Seamless online booking system for a hassle-free experience.",
  },
  {
    id: 5,
    icon: wellMaintainedCars,
    title: "Well Maintained Cars",
    paragraph: "Our vehicles are regularly serviced and kept in top condition.",
  },
  {
    id: 6,
    icon: convenient,
    title: "Convenient",
    paragraph: "Flexible booking options and availability to suit your travel needs.",
  },
];

export default featuresData;
