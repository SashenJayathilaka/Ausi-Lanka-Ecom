"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import coles from "../../public/assets/coles.png";
import jbhifi from "../../public/assets/jbhifi.png";
import woolworths from "../../public/assets/woolworths.png";
import officeworks from "../../public/assets/officeworks.png";
import chemest from "../../public/assets/chemist.webp";

const CompanyLogo = () => {
  const logos = [
    { src: coles, alt: "Coles Supermarket" },
    { src: jbhifi, alt: "JB Hi-Fi Electronics" },
    { src: woolworths, alt: "Woolworths Supermarket" },
    { src: officeworks, alt: "Officeworks Stationery" },
    { src: chemest, alt: "Chemist Warehouse" },
  ];

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 py-16 relative overflow-hidden transition-colors duration-300">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px] opacity-20 dark:opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200 dark:bg-blue-800/20 rounded-full blur-[100px] opacity-15 dark:opacity-10"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Trusted by Leading Australian Retailers
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {`We partner with Australia's most recognized brands to bring you
            authentic products`}
          </p>
        </div>

        {/* Logo marquee container */}
        <div className="relative h-32 overflow-hidden">
          {/* Gradient fade edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-20"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-20"></div>

          {/* First marquee row */}
          <motion.div
            className="absolute top-0 flex items-center h-full"
            animate={{
              x: ["0%", "-100%"],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...logos, ...logos].map((logo, index) => (
              <motion.div
                key={`logo-${index}`}
                className="mx-8 flex items-center h-full"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="relative group h-20 w-48">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    className="object-contain h-full w-full grayscale opacity-90 dark:opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    quality={100}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second marquee row (reverse direction) */}
          <motion.div
            className="absolute bottom-0 flex items-center h-full"
            animate={{
              x: ["-100%", "0%"],
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...logos, ...logos].map((logo, index) => (
              <motion.div
                key={`logo-reverse-${index}`}
                className="mx-8 flex items-center h-full"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="relative group h-20 w-48">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    className="object-contain h-full w-full grayscale opacity-90 dark:opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    quality={100}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md cursor-pointer">
            Become a Partner
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogo;
