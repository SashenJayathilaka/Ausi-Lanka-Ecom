"use client";

import { fadeIn, textVariant } from "@/utils/motion";
import { motion } from "framer-motion";
import { BiTime } from "react-icons/bi";
import { BsStack } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { HiLightBulb } from "react-icons/hi";

const ServicesSection = () => {
  const services = [
    {
      icon: <BsStack className="w-8 h-8 text-indigo-600" />,
      title: "Product Sourcing",
      description:
        "We help you access authentic products directly from trusted Australian retailers.",
      link: "#learn-more",
    },
    {
      icon: <HiLightBulb className="w-8 h-8 text-amber-400" />,
      title: "Order Fulfillment",
      description:
        "Fast, reliable shipping methods tailored to your needs — with full visibility.",
      link: "#learn-more",
    },
    {
      icon: <FiSettings className="w-8 h-8 text-red-400" />,
      title: "Smart Automation",
      description:
        "From placing orders to status updates — automation makes it seamless.",
      link: "#learn-more",
    },
    {
      icon: <BiTime className="w-8 h-8 text-cyan-400" />,
      title: "Clear Communication",
      description:
        "Track your shipments, customer requests, and delivery performance with ease.",
      link: "#learn-more",
    },
  ];

  return (
    <section
      id="services"
      className="py-20 container mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={fadeIn("up", 0.3)}
        className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24"
      >
        {/* Header */}
        <motion.div variants={fadeIn("right", 0.4)} className="md:w-1/3">
          <motion.h2
            variants={textVariant(0.2)}
            className="text-3xl md:text-4xl font-bold mb-6 md:w-4/5"
          >
            Future-Ready Support Built for You
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.5)}
            className="text-gray-600 text-lg mb-4 md:w-4/5"
          >
            {`Let’s talk about your needs, define success, and solve your biggest
            delivery or product sourcing challenges — together.`}
          </motion.p>
          <motion.div variants={fadeIn("up", 0.6)} className="space-y-3">
            <motion.div
              variants={fadeIn("right", 0.7)}
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
              </div>
              <span className="text-gray-600">User-friendly design</span>
            </motion.div>
            <motion.div
              variants={fadeIn("right", 0.8)}
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
              </div>
              <span className="text-gray-600">Reliable delivery</span>
            </motion.div>
          </motion.div>
          <motion.button
            variants={fadeIn("up", 0.9)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 bg-indigo-600 text-white px-8 py-3 cursor-pointer rounded-full hover:bg-indigo-700 transition-colors"
          >
            Get started
          </motion.button>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={fadeIn("left", 0.4)}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", 0.3 * (index + 1))}
              whileHover={{ scale: 1.05 }}
              className="bg-white max-w-72 cursor-pointer rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <motion.div
                variants={fadeIn("down", 0.4 * (index + 1))}
                className="mb-4"
              >
                {service.icon}
              </motion.div>
              <motion.h3
                variants={textVariant(0.3)}
                className="text-xl font-semibold mb-2"
              >
                {service.title}
              </motion.h3>
              <motion.p
                variants={fadeIn("up", 0.5 * (index + 1))}
                className="text-gray-600 mb-4"
              >
                {service.description}
              </motion.p>
              <motion.a
                variants={fadeIn("up", 0.6 * (index + 1))}
                href={service.link}
                className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
              >
                LEARN MORE
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
