import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const WhyChooseUs = () => {
  return (
    <>
      <section id="services" className="py-8 md:pt-20  ">
        <div className="container">
          <SectionTitle
            title="Why Choose Us"
            center={true}
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;
