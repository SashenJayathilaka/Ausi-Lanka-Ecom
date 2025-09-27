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
    <div className="w-full bg-gradient-to-t  dark:from-purple-900/30 dark:to-gray-900 py-16 relative overflow-hidden transition-colors duration-300">
      {/* Halloween decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200/50 dark:bg-orange-500/20 rounded-full blur-[100px] opacity-30 dark:opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/50 dark:bg-purple-600/20 rounded-full blur-[100px] opacity-25 dark:opacity-15"></div>

        {/* Floating Halloween elements - visible in both modes */}
        <div className="absolute top-10 left-1/4 text-4xl animate-bounce-slow opacity-80 dark:opacity-100">
          🎃
        </div>
        <div className="absolute bottom-10 right-1/4 text-3xl animate-bounce-medium opacity-80 dark:opacity-100">
          🦇
        </div>
        <div className="absolute top-1/3 left-10 text-2xl animate-spin-slow opacity-80 dark:opacity-100">
          🕷️
        </div>
        <div className="absolute bottom-1/4 right-20 text-3xl animate-pulse-slow opacity-80 dark:opacity-100">
          👻
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with Halloween theme */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-3 relative inline-block">
            <span className="absolute -inset-3 bg-orange-200/50 dark:bg-purple-800/30 blur-md -z-10 rounded-lg transition-colors duration-300"></span>
            Trusted by Leading Australian Retailers
          </h2>
          <p className="text-lg text-gray-700 dark:text-orange-100 max-w-2xl mx-auto transition-colors duration-300">
            {`We partner with Australia's most recognized brands to bring you
            authentic products`}
          </p>
        </div>

        {/* Logo marquee container */}
        <div className="relative h-32 overflow-hidden">
          {/* Gradient fade edges with Halloween colors */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-purple-900 to-transparent z-20 transition-colors duration-300"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-purple-900 to-transparent z-20 transition-colors duration-300"></div>

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
                  <div className="absolute -inset-2 bg-orange-100/50 dark:bg-purple-600/20 rounded-lg blur-md group-hover:bg-orange-200/50 dark:group-hover:bg-purple-600/30 transition-all duration-300 -z-10"></div>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    className="object-contain h-full w-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
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
                  <div className="absolute -inset-2 bg-purple-100/50 dark:bg-purple-600/20 rounded-lg blur-md group-hover:bg-purple-200/50 dark:group-hover:bg-purple-600/30 transition-all duration-300 -z-10"></div>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    className="object-contain h-full w-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    quality={100}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA button with Halloween theme */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 dark:from-orange-600 dark:to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10">Become a Partner</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 relative z-10"
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

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes bounce-medium {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
        .animate-bounce-medium {
          animation: bounce-medium 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CompanyLogo;
