"use client";

import { LkrFormat } from "@/utils/format";
import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const Hero = () => {
  const router = useRouter();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [speed, setSpeed] = useState<number>(50);

  useEffect(() => {
    setSpeed(Math.floor(Math.random() * 90) + 10);
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-t from-orange-50/30 via-purple-900/20 to-gray-900 dark:from-gray-900 dark:to-purple-900/40 transition-colors duration-500"
    >
      {/* Halloween Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-orange-500/20 dark:bg-orange-900/20 blur-xl opacity-30 dark:opacity-20"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-purple-500/20 dark:bg-purple-800/30 blur-xl opacity-25 dark:opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-red-500/10 dark:bg-red-900/10 blur-xl opacity-20 dark:opacity-15"></div>

        {/* Floating bats animation */}
        <div className="absolute top-10 right-1/4 animate-bat-flight-1">
          <span className="text-2xl">🦇</span>
        </div>
        <div className="absolute top-1/4 left-1/4 animate-bat-flight-2">
          <span className="text-xl">🦇</span>
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-bat-flight-3">
          <span className="text-lg">🦇</span>
        </div>

        {/* Halloween pumpkin decoration */}
        <div className="absolute bottom-5 left-5 text-5xl animate-pulse-slow">
          🎃
        </div>
        <div className="absolute top-5 right-10 text-4xl animate-pulse-medium">
          👻
        </div>
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
            {/* Halloween-themed badges */}
            <div className="flex items-center gap-2 bg-orange-100 dark:bg-purple-900 shadow-sm dark:shadow-purple-900/20 w-fit px-4 py-2 rounded-full hover:bg-orange-200 dark:hover:bg-purple-800 transition-all cursor-pointer group border border-orange-200 dark:border-purple-700">
              <span className="text-yellow-600 group-hover:rotate-12 transition-transform">
                🎃
              </span>
              <span className="text-sm font-medium dark:text-orange-100">
                Spooky Season Specials
              </span>
            </div>
            <div className="flex items-center gap-2 bg-orange-100 dark:bg-purple-900 shadow-sm dark:shadow-purple-900/20 w-fit px-4 py-2 rounded-full hover:bg-orange-200 dark:hover:bg-purple-800 transition-all cursor-pointer group border border-orange-200 dark:border-purple-700">
              <span className="text-green-600 group-hover:rotate-12 transition-transform">
                🕷️
              </span>
              <span className="text-sm font-medium dark:text-orange-100">
                10,000+ Happy Customers
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={textVariant(0.3)}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight dark:text-white"
          >
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-orange-100/50 dark:bg-orange-900/30 rounded-lg -rotate-2 -z-10 transition-colors duration-500"></span>
              <span className="relative">Authentic Aussie Goods</span>
            </span>{" "}
            <br />
            Delivered to Your{" "}
            <span className="text-orange-500 dark:text-orange-400 relative inline-block transition-colors duration-500">
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
                  strokeDasharray="5,5"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-gray-700 dark:text-orange-100 text-lg md:text-xl max-w-xl transition-colors duration-500"
          >
            Skip the import headaches! We handle customs, shipping, and quality
            checks so you can enjoy premium Australian products at competitive
            prices with
            <span className="font-semibold text-orange-600 dark:text-orange-400 transition-colors duration-500">
              {" "}
              zero hidden fees
            </span>
            .
          </motion.p>

          <motion.div
            variants={fadeIn("up", 0.5)}
            className="flex flex-col sm:flex-row gap-4 max-w-md"
          >
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-4 border border-orange-200 dark:border-purple-700 rounded-xl hover:bg-orange-50 dark:hover:bg-purple-800 transition-all text-gray-700 dark:text-orange-100 bg-orange-100/80 dark:bg-purple-900/80 backdrop-blur-sm hover:shadow-sm cursor-pointer"
            >
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
            <button
              className="flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 rounded-xl text-white transition-all shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => router.push("/product")}
            >
              {`Trick or Treat Shop`}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              <span className="ml-2 text-sm font-medium dark:text-orange-100">
                4.9/5
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  "Rajiv+Fernando",
                  "Dinesh+Rathnayake",
                  "Anjali+Weerasinghe",
                ].map((item, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={index}
                    src={`https://ui-avatars.com/api/?name=${item}&background=ff7518&size=256&rounded=true&bold=true&color=fff&font-size=0.5&length=1&speed=${speed}`}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-600 border-2 border-white dark:border-purple-900 transition-colors duration-500"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700 dark:text-orange-100 transition-colors duration-500">
                Joined by 500+ this week
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Enhanced Halloween Image Section */}
        <motion.div
          variants={fadeIn("left", 0.5)}
          className="w-full md:w-1/2 mt-16 md:mt-0 pl-0 md:pl-12"
        >
          <div className="relative">
            {/* Main product image with Halloween frame */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl dark:shadow-purple-900/50 border-8 border-orange-200 dark:border-purple-800 hover:shadow-2xl dark:hover:shadow-purple-900/70 transition-all duration-300 transform hover:-translate-y-1 halloween-frame">
              <Image
                src="/assets/kangaroo-with-australia.jpg"
                width={600}
                height={600}
                className="w-full h-auto"
                alt="Australian products delivery"
                unoptimized
              />
              <div className="absolute top-2 right-2 text-2xl">🦘</div>
              <div className="absolute bottom-2 left-2 text-2xl">🍪</div>
            </div>

            {/* Floating product cards with Halloween theme */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-orange-100 dark:bg-purple-800 p-3 rounded-xl shadow-md dark:shadow-purple-900/30 border border-orange-200 dark:border-purple-700 z-20 hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 bg-orange-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center transition-colors duration-500">
                <Image
                  src="/assets/Swisse Beauty Collagen.webp"
                  alt="image"
                  width={50}
                  height={50}
                  unoptimized
                />
              </div>
              <div className="mt-2 text-xs font-medium dark:text-orange-100">
                Collagen
              </div>
              <div className="text-xs text-gray-600 dark:text-orange-200 transition-colors duration-500">
                {LkrFormat(12342)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -top-6 -right-6 bg-orange-100 dark:bg-purple-800 p-3 rounded-xl shadow-md dark:shadow-purple-900/30 border border-orange-200 dark:border-purple-700 z-20 hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center transition-colors duration-500">
                <span className="text-2xl">
                  <Image
                    src="/assets/product-11.png"
                    alt="image"
                    width={50}
                    height={50}
                    unoptimized
                  />
                </span>
              </div>
              <div className="mt-2 text-xs font-medium dark:text-orange-100">
                Vegemite
              </div>
              <div className="text-xs text-gray-600 dark:text-orange-200 transition-colors duration-500">
                {LkrFormat(1477)}
              </div>
            </motion.div>

            {/* Shipping badge with Halloween theme */}
            <div className="absolute top-4 left-4 bg-orange-100/90 dark:bg-purple-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm dark:shadow-purple-900/30 text-sm font-medium flex items-center gap-1.5 z-20 hover:scale-[1.02] transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-orange-600 dark:text-orange-400 transition-colors duration-500"
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
              <span className="dark:text-orange-100 transition-colors duration-500">
                Delivery in 7-14 days
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Video Modal with Halloween theme */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-4xl mx-4"
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-10 right-0 text-orange-300 hover:text-orange-100 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>

              <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-orange-500">
                <iframe
                  className="w-full h-[500px]"
                  src={`https://www.youtube.com/embed/t_AebrUu4d0?autoplay=1&mute=1&controls=1`}
                  title="How It Works"
                  allow="autoplay"
                  frameBorder="0"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes bat-flight-1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-20px, -15px) rotate(-5deg);
          }
          50% {
            transform: translate(-40px, 0px) rotate(0deg);
          }
          75% {
            transform: translate(-20px, 15px) rotate(5deg);
          }
        }
        @keyframes bat-flight-2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(15px, -10px) rotate(5deg);
          }
          50% {
            transform: translate(30px, 0px) rotate(0deg);
          }
          75% {
            transform: translate(15px, 10px) rotate(-5deg);
          }
        }
        @keyframes bat-flight-3 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -20px) rotate(-5deg);
          }
          50% {
            transform: translate(20px, -40px) rotate(0deg);
          }
          75% {
            transform: translate(10px, -20px) rotate(5deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        @keyframes pulse-medium {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }
        .animate-bat-flight-1 {
          animation: bat-flight-1 10s ease-in-out infinite;
        }
        .animate-bat-flight-2 {
          animation: bat-flight-2 8s ease-in-out infinite;
        }
        .animate-bat-flight-3 {
          animation: bat-flight-3 12s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-pulse-medium {
          animation: pulse-medium 2s ease-in-out infinite;
        }
        .halloween-frame {
          position: relative;
        }
        .halloween-frame:before {
          content: "";
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          border: 2px solid orange;
          border-radius: 25px;
          z-index: -1;
          opacity: 0.5;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 165, 0, 0.1),
            transparent
          );
        }
      `}</style>
    </section>
  );
};

export default Hero;
