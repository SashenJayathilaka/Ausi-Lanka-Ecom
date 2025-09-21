"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import {
  FiArrowRight,
  FiPackage,
  FiTruck,
  FiSearch,
  FiSettings,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

const FeaturesSection = () => {
  const router = useRouter();

  const features = [
    {
      icon: <FiSearch className="w-8 h-8" />,
      title: "Tell Us What You Need",
      description:
        "Describe your product requirements and we'll connect you with the best Australian suppliers. Our AI-powered matching system finds perfect products for your market.",
      color: "bg-purple-100 dark:bg-purple-900/30",
      highlight: "text-purple-600 dark:text-purple-400",
      emoji: "🔮",
    },
    {
      icon: <FiSettings className="w-8 h-8" />,
      title: "Customize Your Order",
      description:
        "Choose between ✈️ Air Cargo (7-10 days) or 🚢 Sea Shipping (3-4 weeks). Get real-time pricing with all duties and taxes included upfront.",
      color: "bg-orange-100 dark:bg-orange-900/30",
      highlight: "text-orange-600 dark:text-orange-400",
      emoji: "🎃",
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: "Hassle-Free Delivery",
      description:
        "We handle customs clearance, quality checks, and last-mile delivery. Track your shipment in real-time from warehouse to doorstep.",
      color: "bg-green-100 dark:bg-green-900/30",
      highlight: "text-green-600 dark:text-green-400",
      emoji: "🦇",
    },
    {
      icon: <FiPackage className="w-8 h-8" />,
      title: "Quality Assurance",
      description:
        "Every product undergoes rigorous quality checks before shipping. 30-day return policy for damaged or incorrect items.",
      color: "bg-red-100 dark:bg-red-900/30",
      highlight: "text-red-600 dark:text-red-400",
      emoji: "👻",
    },
  ];

  return (
    <motion.section
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="w-full bg-gradient-to-b from-purple-50 to-gray-50 dark:from-gray-900 dark:to-purple-900/20 transition-colors duration-500 relative overflow-hidden"
    >
      {/* Halloween decorations */}
      <div className="absolute top-10 left-5 text-4xl animate-bounce-slow">
        🎃
      </div>
      <div className="absolute top-20 right-8 text-3xl animate-pulse-slow">
        👻
      </div>
      <div className="absolute bottom-20 left-10 text-2xl animate-spin-slow">
        🕷️
      </div>
      <div className="absolute bottom-10 right-5 text-3xl animate-bounce-medium">
        🦇
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
        {/* Background elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl opacity-20 -z-10 transition-colors duration-500"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl opacity-15 -z-10 transition-colors duration-500"></div>

        <motion.div variants={fadeIn("up", 0.3)} className="text-center mb-16">
          <motion.h2
            variants={textVariant(0.2)}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-500"
          >
            Streamline Your{" "}
            <span className="text-orange-600 dark:text-orange-400 transition-colors duration-500">
              Australia-Sri Lanka
            </span>{" "}
            Trade
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500"
          >
            Our end-to-end solution handles everything from sourcing to
            delivery, so you can focus on growing your business
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeIn("up", 0.5)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", 0.3 * (index + 1))}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              {/* Halloween emoji decoration */}
              <div className="absolute -top-3 -right-3 text-2xl z-20">
                {feature.emoji}
              </div>

              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-purple-950/50 overflow-hidden border border-orange-200 dark:border-purple-700 hover:shadow-xl dark:hover:shadow-purple-950/70 transition-all duration-300 relative">
                {/* Spooky border effect on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-400/30 transition-all duration-300"></div>

                <div
                  className={`${feature.color} p-6 flex justify-center transition-colors duration-500 relative`}
                >
                  {/* Halloween pattern overlay */}
                  <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMCAwIEwgNDAgMCBMIDQwIDQwIEwgMCA0MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjdmMWYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')]"></div>

                  <motion.div
                    variants={fadeIn("down", 0.4 * (index + 1))}
                    className={`w-20 h-20 rounded-2xl ${feature.color} flex items-center justify-center group-hover:rotate-6 transition-all duration-300 relative z-10`}
                  >
                    <motion.div
                      variants={fadeIn("up", 0.5 * (index + 1))}
                      className={`${feature.highlight} transition-colors duration-500`}
                    >
                      {feature.icon}
                    </motion.div>
                  </motion.div>
                </div>
                <div className="p-6 pt-0">
                  <motion.h3
                    variants={textVariant(0.3)}
                    className="text-xl font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-500"
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    variants={fadeIn("up", 0.6 * (index + 1))}
                    className="text-gray-700 dark:text-gray-400 mb-4 transition-colors duration-500"
                  >
                    {feature.description}
                  </motion.p>
                  <motion.a
                    href="#"
                    variants={fadeIn("up", 0.7 * (index + 1))}
                    className={`inline-flex items-center ${feature.highlight} font-medium group-hover:underline transition-colors duration-500`}
                  >
                    Learn more{" "}
                    <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeIn("up", 0.7)} className="text-center">
          <motion.button
            variants={fadeIn("up", 0.8)}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(255, 165, 0, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-gradient-to-r from-orange-600 to-purple-600 dark:from-orange-700 dark:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group"
          >
            <span
              className="relative z-10 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => router.push("/product")}
            >
              Start Sourcing Today{" "}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute -z-0 w-full h-full rounded-xl bg-orange-600/30 dark:bg-orange-700/30 blur-xl top-0 left-0 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute inset-0 rounded-xl border-2 border-white/10"></div>
          </motion.button>

          <motion.p
            variants={fadeIn("up", 0.9)}
            className="text-gray-600 dark:text-gray-400 mt-6 text-sm transition-colors duration-500"
          >
            Trusted by 500+ Sri Lankan businesses importing from Australia
          </motion.p>
        </motion.div>
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
    </motion.section>
  );
};

export default FeaturesSection;
