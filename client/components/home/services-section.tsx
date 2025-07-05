"use client";

import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { motion } from "framer-motion";
import { BsShieldCheck, BsStack } from "react-icons/bs";
import { FiSettings, FiTruck } from "react-icons/fi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { RiCustomerService2Line } from "react-icons/ri";

const ServicesSection = () => {
  const services = [
    {
      icon: <BsStack className="w-8 h-8" />,
      title: "Global Product Sourcing",
      description:
        "Access authentic products from trusted international retailers with our curated network of suppliers.",
      color: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: "Smart Fulfillment",
      description:
        "Choose between express air or economical sea shipping with real-time tracking for complete visibility.",
      color: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: <FiSettings className="w-8 h-8" />,
      title: "Automated Ordering",
      description:
        "Our system automates order placement, status updates, and inventory management to save you time.",
      color: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: <HiOutlineGlobeAlt className="w-8 h-8" />,
      title: "Customs Expertise",
      description:
        "We handle all customs clearance and documentation to ensure smooth cross-border delivery.",
      color: "bg-cyan-100 dark:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
    {
      icon: <BsShieldCheck className="w-8 h-8" />,
      title: "Quality Assurance",
      description:
        "Every product undergoes rigorous quality checks before shipping to guarantee satisfaction.",
      color: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: <RiCustomerService2Line className="w-8 h-8" />,
      title: "Dedicated Support",
      description:
        "24/7 customer service to assist with any questions or issues throughout your order journey.",
      color: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-3xl opacity-20 transition-colors duration-500"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl opacity-15 transition-colors duration-500"></div>
      </div>

      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            variants={fadeIn("up", 0.2)}
            className="inline-block bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-4 transition-colors duration-500"
          >
            Our Services
          </motion.span>
          <motion.h2
            variants={textVariant(0.3)}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-500"
          >
            End-to-End Solutions for{" "}
            <span className="text-indigo-600 dark:text-indigo-400 transition-colors duration-500">
              Global Commerce
            </span>
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500"
          >
            We handle the complexities of international trade so you can focus
            on growing your business.
          </motion.p>
        </div>

        {/* Services grid */}
        <motion.div
          variants={fadeIn("up", 0.5)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", index * 0.1)}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-950/50 overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-950/70 transition-all duration-300">
                <div
                  className={`${service.color} p-6 flex justify-center transition-colors duration-500`}
                >
                  <motion.div
                    variants={fadeIn("down", 0.4 * (index + 1))}
                    className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center group-hover:rotate-6 transition-colors duration-500`}
                  >
                    <motion.div
                      variants={fadeIn("up", 0.5 * (index + 1))}
                      className={`${service.iconColor} transition-colors duration-500`}
                    >
                      {service.icon}
                    </motion.div>
                  </motion.div>
                </div>
                <div className="p-6 pt-0">
                  <motion.h3
                    variants={textVariant(0.3)}
                    className="text-xl font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-500"
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p
                    variants={fadeIn("up", 0.6 * (index + 1))}
                    className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-500"
                  >
                    {service.description}
                  </motion.p>
                  <motion.a
                    href="#"
                    variants={fadeIn("up", 0.7 * (index + 1))}
                    className={`inline-flex items-center ${service.iconColor} font-medium group-hover:underline transition-colors duration-500`}
                  >
                    Learn more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeIn("up", 0.8)} className="text-center mt-16">
          <motion.div
            variants={fadeIn("up", 0.9)}
            className="inline-flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950/50 px-8 py-6 border border-gray-100 dark:border-gray-700 transition-colors duration-500"
          >
            <div className="text-left">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors duration-500">
                Ready to simplify your international shopping?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-500">
                Join hundreds of satisfied customers today
              </p>
            </div>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-700 dark:to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Now
              </span>
              <div className="absolute -z-0 w-full h-full rounded-lg bg-indigo-600/30 dark:bg-indigo-700/30 blur-xl top-0 left-0 group-hover:opacity-70 transition-opacity"></div>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
