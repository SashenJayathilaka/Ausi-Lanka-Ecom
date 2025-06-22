import Image from "next/image";
import coles from "../../public/assets/coles.png";
import jbhifi from "../../public/assets/jbhifi.png";
import woolworths from "../../public/assets/woolworths.png";
import officeworks from "../../public/assets/officeworks.png";
import chemest from "../../public/assets/chemist.webp";

const CompanyLogo = () => {
  const logos = [coles, jbhifi, woolworths, officeworks, chemest];

  return (
    <div className="w-full container mx-auto py-20 overflow-hidden flex  flex-col sm:flex-row sm:items-center items-start ">
      <div className="w-[300px] shrink-0 px-8 text-gray-600 border-l-4 border-blue-500 bg-white py-2 z-10 sm:text-base text-xl font-semibold sm:text-left  mb-8 sm:mb-0">
        Proud partner at <br /> Hubspot & Segment
      </div>
      <div className="flex animate-marquee whitespace-nowrap">
        {logos.map((logo, index) => (
          <Image
            key={index}
            src={logo}
            alt={`Company Logo ${index + 1}`}
            className="mx-12 h-8 w-36 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
            width={150} // 36 * 4 (for 4x scaling)
            height={150} // 8 * 4 (for 4x scaling)
          />
        ))}
        {/* Duplicate logos for seamless loop */}
        {logos.map((logo, index) => (
          <Image
            key={`duplicate-${index}`}
            src={logo}
            alt={`Company Logo ${index + 1}`}
            className="mx-12 h-8 w-36 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
            width={150} // 36 * 4 (for 4x scaling)
            height={150} // 8 * 4 (for 4x scaling)
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyLogo;
