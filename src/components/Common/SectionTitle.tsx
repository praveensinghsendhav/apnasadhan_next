import Image from "next/image";
const SectionTitle = ({
  title,
  width = "570px",
  center,
  mb = "50px",
}: {
  title: string;
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  return (
    <>
      <div
        className={`w-full ${center ? "mx-auto text-center" : ""} flex items-center justify-center`}
        style={{ maxWidth: width, marginBottom: mb }}
      >
        <Image src="/images/logo/pankh2.png" alt="section-title-shape" width={100} height={30} className="mt-[10px] ml-[-20px]" />
        <h2 className="mb-4 text-3xl font-bold !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-700  sm:text-4xl md:text-[45px] ml-[-60px]">
          {title}
        </h2>
      </div>
    </>
  );
};

export default SectionTitle;
