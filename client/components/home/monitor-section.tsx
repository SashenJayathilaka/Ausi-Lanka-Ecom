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
      time: "Oct 28, 10:30 AM",
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Departed Australia",
      description: "Package left our Sydney warehouse",
      status: "completed",
      time: "Oct 29, 3:45 PM",
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "In Transit",
      description: "Currently en route to Colombo",
      status: "current",
      time: "Expected Oct 31",
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Arrived in Sri Lanka",
      description: "Clearing customs",
      status: "pending",
      time: "Expected Nov 2",
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Out for Delivery",
      description: "Your local courier will contact you",
      status: "pending",
      time: "Expected Nov 3",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-t from-orange-50/50 to-purple-100/30 dark:from-gray-900 dark:to-purple-900/20 transition-colors duration-500 relative overflow-hidden">
      {/* Halloween decorations */}
      <div className="absolute top-10 left-5 text-4xl animate-bounce-slow opacity-80 dark:opacity-100">
        🎃
      </div>
      <div className="absolute top-20 right-8 text-3xl animate-pulse-slow opacity-80 dark:opacity-100">
        👻
      </div>
      <div className="absolute bottom-20 left-10 text-2xl animate-spin-slow opacity-80 dark:opacity-100">
        🕷️
      </div>
      <div className="absolute bottom-10 right-5 text-3xl animate-bounce-medium opacity-80 dark:opacity-100">
        🦇
      </div>

      <motion.section
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl opacity-20 -z-10 transition-colors duration-500"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl opacity-15 -z-10 transition-colors duration-500"></div>

        <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">
          {/* Left side - Content */}
          <motion.div
            variants={fadeIn("right", 0.3)}
            className="w-full lg:w-1/2"
          >
            <motion.div
              variants={fadeIn("up", 0.4)}
              className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/20 px-4 py-2 rounded-full mb-6 transition-colors duration-500"
            >
              <div className="w-8 h-8 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-300 transition-colors duration-500">
                <FiPackage className="w-4 h-4" />
              </div>
              <span className="text-orange-600 dark:text-orange-300 font-medium transition-colors duration-500">
                Real-time Tracking
              </span>
            </motion.div>

            <motion.h2
              variants={textVariant(0.5)}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6 transition-colors duration-500"
            >
              Never Wonder Where <br />
              <span className="text-orange-600 dark:text-orange-400 transition-colors duration-500">
                Your Order
              </span>{" "}
              Is Again
            </motion.h2>

            <motion.p
              variants={fadeIn("up", 0.6)}
              className="text-xl text-gray-700 dark:text-gray-300 mb-8 transition-colors duration-500"
            >
              Our advanced tracking system gives you complete visibility from
              Australian warehouse to your doorstep in Sri Lanka.
            </motion.p>

            <motion.div variants={fadeIn("up", 0.7)} className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 transition-colors duration-500">
                    <FiClock className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                    Estimated Delivery
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -
                    {new Date(
                      Date.now() + 65 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 transition-colors duration-500">
                <motion.div
                  className="bg-orange-600 dark:bg-orange-500 h-2.5 rounded-full transition-colors duration-500"
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
              className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold group transition-colors duration-500"
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-purple-950/50 overflow-hidden border border-orange-200 dark:border-purple-700 transition-colors duration-500"
            >
              <div className="p-6 bg-orange-50 dark:bg-purple-700/50 border-b border-orange-200 dark:border-purple-600 transition-colors duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                    Order #AU-5X4T9P
                  </h3>
                  <span className="text-sm px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded-full transition-colors duration-500">
                    In Transit
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 transition-colors duration-500">
                  From Sydney, Australia to Colombo, Sri Lanka
                </p>
              </div>

              <div className="p-6">
                <div className="relative">
                  {/* Timeline */}
                  <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-600 transition-colors duration-500">
                    <div className="absolute top-0 left-0 w-0.5 h-3/5 bg-orange-500 dark:bg-orange-400 transition-colors duration-500"></div>
                  </div>

                  <div className="space-y-8">
                    {trackingSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        variants={fadeIn("up", index * 0.1)}
                        className="relative pl-12 mb-6"
                      >
                        <div
                          className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                            step.status === "completed"
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300"
                              : step.status === "current"
                                ? "bg-orange-600 dark:bg-orange-500 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div className="ml-2">
                          <h4
                            className={`font-medium transition-colors duration-500 ${
                              step.status === "pending"
                                ? "text-gray-400 dark:text-gray-500"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p
                            className={`text-sm transition-colors duration-500 ${
                              step.status === "pending"
                                ? "text-gray-400 dark:text-gray-500"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {step.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-colors duration-500">
                            {step.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="mt-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 h-48 relative transition-colors duration-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FiMapPin className="w-8 h-8 text-orange-500 dark:text-orange-400 mx-auto mb-2 transition-colors duration-500" />
                      <p className="text-gray-600 dark:text-gray-300 transition-colors duration-500">
                        Live shipment map
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

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

export default MonitorSection;
