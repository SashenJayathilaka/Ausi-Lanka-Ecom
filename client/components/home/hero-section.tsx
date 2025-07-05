"use client";

import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-xl opacity-20 dark:opacity-10"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-blue-200/30 dark:bg-blue-800/20 blur-xl opacity-15 dark:opacity-10"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-100/20 dark:bg-blue-900/10 blur-xl opacity-10 dark:opacity-5"></div>
      </div>

      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 pt-32 pb-16 container mx-auto relative z-10"
      >
        {/* Left Column */}
        <div className="w-full md:w-1/2 space-y-8">
          <motion.div
            variants={fadeIn("right", 0.2)}
            className="flex flex-wrap gap-3"
          >
            {/* Multiple badges */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 w-fit px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer group border border-gray-100 dark:border-gray-700">
              <span className="text-yellow-400 group-hover:rotate-12 transition-transform">
                ★
              </span>
              <span className="text-sm font-medium dark:text-gray-200">
                Trusted Since 2018
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 w-fit px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer group border border-gray-100 dark:border-gray-700">
              <span className="text-green-500 group-hover:rotate-12 transition-transform">
                ✓
              </span>
              <span className="text-sm font-medium dark:text-gray-200">
                10,000+ Happy Customers
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={textVariant(0.3)}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight dark:text-white"
          >
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg -rotate-2 -z-10 transition-colors duration-500"></span>
              <span className="relative">Authentic Aussie Goods</span>
            </span>{" "}
            <br />
            Delivered to Your{" "}
            <span className="text-blue-600 dark:text-blue-400 relative inline-block transition-colors duration-500">
              Sri Lankan Doorstep
              <svg
                className="absolute -bottom-2 left-0 w-full h-2"
                viewBox="0 0 200 20"
              >
                <path
                  d="M0,10 C50,15 100,5 200,10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="0 0"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-xl transition-colors duration-500"
          >
            Skip the import headaches! We handle customs, shipping, and quality
            checks so you can enjoy premium Australian products at competitive
            prices with
            <span className="font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-500">
              {" "}
              zero hidden fees
            </span>
            .
          </motion.p>

          <motion.div
            variants={fadeIn("up", 0.5)}
            className="flex flex-col sm:flex-row gap-4 max-w-md"
          >
            <button className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l3-2z"
                  clipRule="evenodd"
                />
              </svg>
              How It Works
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeIn("up", 0.6)}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm font-medium dark:text-gray-200">
                4.9/5
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 transition-colors duration-500"
                  ></div>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500">
                Joined by 500+ this week
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Enhanced Image Section */}
        <motion.div
          variants={fadeIn("left", 0.5)}
          className="w-full md:w-1/2 mt-16 md:mt-0 pl-0 md:pl-12"
        >
          <div className="relative">
            {/* Main product image */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl dark:shadow-gray-900/50 border-8 border-white dark:border-gray-800 hover:shadow-2xl dark:hover:shadow-gray-900/70 transition-all duration-300 transform hover:-translate-y-1">
              <Image
                src="/assets/hero-sections.png"
                width={600}
                height={600}
                className="w-full h-auto"
                alt="Australian products delivery"
                priority
              />
            </div>

            {/* Floating product cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 z-20 hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center transition-colors duration-500">
                <span className="text-2xl">🥛</span>
              </div>
              <div className="mt-2 text-xs font-medium dark:text-gray-200">
                A2 Milk
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">
                From $8.99
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 z-20 hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center transition-colors duration-500">
                <span className="text-2xl">🍯</span>
              </div>
              <div className="mt-2 text-xs font-medium dark:text-gray-200">
                Manuka Honey
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">
                From $24.99
              </div>
            </motion.div>

            {/* Shipping badge */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm dark:shadow-gray-900/30 text-sm font-medium flex items-center gap-1.5 z-20 hover:scale-[1.02] transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600 dark:text-blue-400 transition-colors duration-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="dark:text-gray-200 transition-colors duration-500">
                Delivery in 7-14 days
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
