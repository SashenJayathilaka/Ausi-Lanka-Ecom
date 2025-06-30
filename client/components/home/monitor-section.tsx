"use client";

import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiPackage,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

const MonitorSection = () => {
  const trackingSteps = [
    {
      icon: <FiPackage className="w-6 h-6" />,
      title: "Order Processed",
      description: "Your items are being prepared for shipment",
      status: "completed",
      time: "May 15, 10:30 AM",
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Departed Australia",
      description: "Package left our Sydney warehouse",
      status: "completed",
      time: "May 17, 3:45 PM",
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "In Transit",
      description: "Currently en route to Colombo",
      status: "current",
      time: "Expected May 20",
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Arrived in Sri Lanka",
      description: "Clearing customs",
      status: "pending",
      time: "Expected May 22",
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Out for Delivery",
      description: "Your local courier will contact you",
      status: "pending",
      time: "Expected May 23",
    },
  ];

  return (
    <motion.section
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-15 -z-10"></div>

      <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">
        {/* Left side - Content */}
        <motion.div variants={fadeIn("right", 0.3)} className="w-full lg:w-1/2">
          <motion.div
            variants={fadeIn("up", 0.4)}
            className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full mb-6"
          >
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <FiPackage className="w-4 h-4" />
            </div>
            <span className="text-emerald-600 font-medium">
              Real-time Tracking
            </span>
          </motion.div>

          <motion.h2
            variants={textVariant(0.5)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6"
          >
            Never Wonder Where <br />
            <span className="text-blue-600">Your Order</span> Is Again
          </motion.h2>

          <motion.p
            variants={fadeIn("up", 0.6)}
            className="text-xl text-gray-600 mb-8"
          >
            Our advanced tracking system gives you complete visibility from
            Australian warehouse to your doorstep in Sri Lanka.
          </motion.p>

          <motion.div variants={fadeIn("up", 0.7)} className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <FiClock className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Estimated Delivery
                </h4>
                <p className="text-gray-600">May 23 - May 25, 2023</p>
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <motion.div
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                transition={{ duration: 1 }}
                style={{ originX: 0 }}
              />
            </div>
          </motion.div>

          <motion.a
            variants={fadeIn("up", 0.8)}
            href="#"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold group"
          >
            View detailed tracking history
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Right side - Tracking dashboard */}
        <motion.div
          variants={fadeIn("left", 0.3)}
          className="w-full lg:w-1/2 relative"
        >
          <motion.div
            variants={fadeIn("up", 0.4)}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Order #AU-5X4T9P
                </h3>
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                  In Transit
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                From Sydney, Australia to Colombo, Sri Lanka
              </p>
            </div>

            <div className="p-6">
              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200">
                  <div className="absolute top-0 left-0 w-0.5 h-3/5 bg-blue-500"></div>
                </div>

                <div className="space-y-8">
                  {trackingSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      variants={fadeIn("up", index * 0.1)}
                      className="relative pl-12 mb-6" // Increased pl-10 to pl-12 and added mb-6 for vertical spacing
                    >
                      <div
                        className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          step.status === "completed"
                            ? "bg-blue-100 text-blue-600"
                            : step.status === "current"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div className="ml-2">
                        {" "}
                        {/* Added ml-2 for additional horizontal spacing */}
                        <h4
                          className={`font-medium ${
                            step.status === "pending"
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p
                          className={`text-sm ${
                            step.status === "pending"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {step.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {step.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 rounded-lg overflow-hidden bg-gray-100 h-48 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FiMapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-500">Live shipment map</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MonitorSection;
