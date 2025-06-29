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
      color: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: "Smart Fulfillment",
      description:
        "Choose between express air or economical sea shipping with real-time tracking for complete visibility.",
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: <FiSettings className="w-8 h-8" />,
      title: "Automated Ordering",
      description:
        "Our system automates order placement, status updates, and inventory management to save you time.",
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      icon: <HiOutlineGlobeAlt className="w-8 h-8" />,
      title: "Customs Expertise",
      description:
        "We handle all customs clearance and documentation to ensure smooth cross-border delivery.",
      color: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      icon: <BsShieldCheck className="w-8 h-8" />,
      title: "Quality Assurance",
      description:
        "Every product undergoes rigorous quality checks before shipping to guarantee satisfaction.",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: <RiCustomerService2Line className="w-8 h-8" />,
      title: "Dedicated Support",
      description:
        "24/7 customer service to assist with any questions or issues throughout your order journey.",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-100 blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-blue-100 blur-3xl opacity-15"></div>
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
            className="inline-block bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            Our Services
          </motion.span>
          <motion.h2
            variants={textVariant(0.3)}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            End-to-End Solutions for{" "}
            <span className="text-indigo-600">Global Commerce</span>
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
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
              <div className="h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className={`${service.color} p-6 flex justify-center`}>
                  <motion.div
                    variants={fadeIn("down", 0.4 * (index + 1))}
                    className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center group-hover:rotate-6 transition-transform`}
                  >
                    <motion.div
                      variants={fadeIn("up", 0.5 * (index + 1))}
                      className={`${service.iconColor}`}
                    >
                      {service.icon}
                    </motion.div>
                  </motion.div>
                </div>
                <div className="p-6 pt-0">
                  <motion.h3
                    variants={textVariant(0.3)}
                    className="text-xl font-semibold mb-3 text-gray-900"
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p
                    variants={fadeIn("up", 0.6 * (index + 1))}
                    className="text-gray-600 mb-4"
                  >
                    {service.description}
                  </motion.p>
                  <motion.a
                    href="#"
                    variants={fadeIn("up", 0.7 * (index + 1))}
                    className={`inline-flex items-center ${service.iconColor} font-medium group-hover:underline`}
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
            className="inline-flex flex-col sm:flex-row gap-4 items-center bg-white rounded-xl shadow-lg px-8 py-6 border border-gray-100"
          >
            <div className="text-left">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Ready to simplify your international shopping?
              </h4>
              <p className="text-gray-600">
                Join hundreds of satisfied customers today
              </p>
            </div>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Now
              </span>
              <div className="absolute -z-0 w-full h-full rounded-lg bg-indigo-600/30 blur-xl top-0 left-0 group-hover:opacity-70 transition-opacity"></div>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
