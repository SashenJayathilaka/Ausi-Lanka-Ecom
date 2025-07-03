/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-100/50 blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-blue-200/30 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-100/20 blur-xl"></div>
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
            <div className="flex items-center gap-2 bg-white shadow-sm w-fit px-4 py-2 rounded-full hover:bg-gray-50 transition-all cursor-pointer group border border-gray-100">
              <span className="text-yellow-400 group-hover:rotate-12 transition-transform">
                ★
              </span>
              <span className="text-sm font-medium">Trusted Since 2018</span>
            </div>
            <div className="flex items-center gap-2 bg-white shadow-sm w-fit px-4 py-2 rounded-full hover:bg-gray-50 transition-all cursor-pointer group border border-gray-100">
              <span className="text-green-500 group-hover:rotate-12 transition-transform">
                ✓
              </span>
              <span className="text-sm font-medium">
                10,000+ Happy Customers
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={textVariant(0.3)}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-blue-100/50 rounded-lg -rotate-2 -z-10"></span>
              Authentic Aussie Goods
            </span>{" "}
            <br />
            Delivered to Your{" "}
            <span className="text-blue-600 relative inline-block">
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
            className="text-gray-600 text-lg md:text-xl max-w-xl"
          >
            Skip the import headaches! We handle customs, shipping, and quality
            checks so you can enjoy premium Australian products at competitive
            prices with
            <span className="font-semibold text-blue-600">
              {" "}
              zero hidden fees
            </span>
            .
          </motion.p>

          <motion.div
            variants={fadeIn("up", 0.5)}
            className="flex flex-col sm:flex-row gap-4 max-w-md"
          >
            {/* Enhanced CTA section */}
            {/*             <div className="flex-1 relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-600 bg-white/80 backdrop-blur-sm"
              />
              <button className="absolute right-2 top-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-100 active:scale-95">
                Get Started →
              </button>
            </div> */}
            <button className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-600 bg-white/80 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
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
              <span className="ml-2 text-sm font-medium">4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                  ></div>
                ))}
              </div>
              <span className="text-sm text-gray-600">
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
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border-8 border-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              {/*         <Image
                src="/assets/hero-products.jpg"
                alt="Australian products"
                width={600}
                height={600}
                className="w-full h-auto"
              /> */}
              <img
                src="https://png.pngtree.com/png-clipart/20240416/original/pngtree-logistics-business-landing-header-vector-png-image_14868714.png"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </div>

            {/* Floating product cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white p-3 rounded-xl shadow-md border border-gray-100 z-20"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🥛</span>
              </div>
              <div className="mt-2 text-xs font-medium">A2 Milk</div>
              <div className="text-xs text-gray-500">From $8.99</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -top-6 -right-6 bg-white p-3 rounded-xl shadow-md border border-gray-100 z-20"
            >
              <div className="w-24 h-24 bg-orange-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍯</span>
              </div>
              <div className="mt-2 text-xs font-medium">Manuka Honey</div>
              <div className="text-xs text-gray-500">From $24.99</div>
            </motion.div>

            {/* Shipping badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-sm font-medium flex items-center gap-1.5 z-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
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
              Delivery in 7-14 days
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scrolling brand logos */}
      {/*       <div className="bg-white/80 backdrop-blur-sm py-6 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-4">
            Trusted by thousands to import from these Australian brands:
          </p>
          <div className="flex overflow-hidden gap-12 items-center justify-center">
            {[
              "Blackmores",
              "Swisse",
              "A2 Milk",
              "Jurlique",
              "Lucas' Papaw",
              "Tim Tams",
            ].map((brand, index) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0.6 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-lg font-medium text-gray-700 whitespace-nowrap"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default Hero;
