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

const FeaturesSection = () => {
  const features = [
    {
      icon: <FiSearch className="w-8 h-8" />,
      title: "Tell Us What You Need",
      description:
        "Describe your product requirements and we'll connect you with the best Australian suppliers. Our AI-powered matching system finds perfect products for your market.",
      color: "bg-indigo-100",
      highlight: "text-indigo-600",
    },
    {
      icon: <FiSettings className="w-8 h-8" />,
      title: "Customize Your Order",
      description:
        "Choose between ✈️ Air Cargo (7-10 days) or 🚢 Sea Shipping (3-4 weeks). Get real-time pricing with all duties and taxes included upfront.",
      color: "bg-rose-100",
      highlight: "text-rose-600",
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: "Hassle-Free Delivery",
      description:
        "We handle customs clearance, quality checks, and last-mile delivery. Track your shipment in real-time from warehouse to doorstep.",
      color: "bg-amber-100",
      highlight: "text-amber-600",
    },
    {
      icon: <FiPackage className="w-8 h-8" />,
      title: "Quality Assurance",
      description:
        "Every product undergoes rigorous quality checks before shipping. 30-day return policy for damaged or incorrect items.",
      color: "bg-emerald-100",
      highlight: "text-emerald-600",
    },
  ];

  return (
    <motion.section
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative"
    >
      {/* Background elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-15 -z-10"></div>

      <motion.div variants={fadeIn("up", 0.3)} className="text-center mb-16">
        <motion.h2
          variants={textVariant(0.2)}
          className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
        >
          Streamline Your{" "}
          <span className="text-blue-600">Australia-Sri Lanka</span> Trade
        </motion.h2>
        <motion.p
          variants={fadeIn("up", 0.4)}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Our end-to-end solution handles everything from sourcing to delivery,
          so you can focus on growing your business
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
            className="group"
          >
            <div className="h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className={`${feature.color} p-6 flex justify-center`}>
                <motion.div
                  variants={fadeIn("down", 0.4 * (index + 1))}
                  className={`w-20 h-20 rounded-2xl ${feature.color} flex items-center justify-center group-hover:rotate-6 transition-transform`}
                >
                  <motion.div
                    variants={fadeIn("up", 0.5 * (index + 1))}
                    className={`${feature.highlight}`}
                  >
                    {feature.icon}
                  </motion.div>
                </motion.div>
              </div>
              <div className="p-6 pt-0">
                <motion.h3
                  variants={textVariant(0.3)}
                  className="text-xl font-semibold mb-3 text-gray-900"
                >
                  {feature.title}
                </motion.h3>
                <motion.p
                  variants={fadeIn("up", 0.6 * (index + 1))}
                  className="text-gray-600 mb-4"
                >
                  {feature.description}
                </motion.p>
                <motion.a
                  href="#"
                  variants={fadeIn("up", 0.7 * (index + 1))}
                  className={`inline-flex items-center ${feature.highlight} font-medium group-hover:underline`}
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
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Start Sourcing Today{" "}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute -z-0 w-full h-full rounded-xl bg-blue-600/30 blur-xl top-0 left-0 group-hover:opacity-70 transition-opacity"></div>
          <div className="absolute inset-0 rounded-xl border-2 border-white/10"></div>
        </motion.button>

        <motion.p
          variants={fadeIn("up", 0.9)}
          className="text-gray-500 mt-6 text-sm"
        >
          Trusted by 500+ Sri Lankan businesses importing from Australia
        </motion.p>
      </motion.div>
    </motion.section>
  );
};

export default FeaturesSection;
