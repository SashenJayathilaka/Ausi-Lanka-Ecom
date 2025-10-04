"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiX, FiGift, FiClock, FiShoppingCart } from "react-icons/fi";

const HalloweenAdvertisement = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate time until October 20th, 2025
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = new Date("2025-10-20T23:59:59");
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Show popup after 3 seconds
    const popupTimer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem("halloween_popup_seen_2025");
      if (!hasSeenPopup) {
        setShowPopup(true);
      }
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(popupTimer);
    };
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("halloween_popup_seen_2025", "true");
  };

  const handleShopNow = () => {
    // Redirect to fish oil product page or add to cart
    window.location.href = "/product";
    localStorage.setItem("halloween_popup_seen_2025", "true");
  };

  const normalPrice = 14050;
  const specialPrice = 12250;
  const savings = normalPrice - specialPrice;

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-[95vw] sm:max-w-md mx-auto"
          >
            {/* Main Popup Content */}
            <div className="bg-gradient-to-br from-orange-500 via-purple-600 to-red-500 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-orange-300">
              {/* Halloween Header */}
              <div className="relative p-4 sm:p-6 text-center bg-gradient-to-r from-orange-600 to-purple-700 mt-4 sm:mt-6">
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 text-3xl sm:text-4xl">
                  🎃
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  SPOOKY HALLOWEEN DEAL 2025!
                </h2>
                <div className="flex justify-center space-x-1 sm:space-x-2 text-white">
                  <span className="text-base sm:text-lg">👻</span>
                  <span className="text-base sm:text-lg">🦇</span>
                  <span className="text-base sm:text-lg">🍬</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
                {/* Product Info */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://swisse.us/cdn/shop/files/US_UBODRLSWILDFISHOIL1000MG400CAP_ProductCarousel_Packshot_1700x1700_86983cd4-cb2d-4a3e-b8d2-e42a9dc3110a.png?v=1751467554"
                      alt="Swisse Fish Oil"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                    />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight">
                    Swisse Ultiboost Odourless Wild Fish Oil 1000mg 500 Capsules
                    Exclusive Size
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    High-quality Australian fish oil with omega-3 fatty acids
                  </p>
                </div>

                {/* Pricing */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-through">
                      Normal Price:
                    </span>
                    <span className="text-sm sm:text-lg font-bold text-gray-500 dark:text-gray-400 line-through">
                      Rs {normalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-orange-600 dark:text-orange-400 font-bold">
                      Halloween Price:
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                      Rs {specialPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-1 sm:mt-2 bg-green-100 dark:bg-green-900/30 rounded sm:rounded-lg p-1 sm:p-2 text-center">
                    <span className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-bold">
                      Save Rs {savings.toLocaleString()}!
                    </span>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <FiClock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">
                      Offer ends October 20, 2025:
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                    <div className="bg-white dark:bg-gray-700 rounded sm:rounded-lg p-1 sm:p-2">
                      <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                        {timeLeft.days.toString().padStart(2, "0")}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Days
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded sm:rounded-lg p-1 sm:p-2">
                      <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                        {timeLeft.hours.toString().padStart(2, "0")}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Hours
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded sm:rounded-lg p-1 sm:p-2">
                      <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                        {timeLeft.minutes.toString().padStart(2, "0")}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Mins
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded sm:rounded-lg p-1 sm:p-2">
                      <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                        {timeLeft.seconds.toString().padStart(2, "0")}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Secs
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] sm:text-xs text-center text-purple-600 dark:text-purple-400 mt-1 sm:mt-2">
                    Valid until: October 20, 2025
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShopNow}
                    className="w-full bg-gradient-to-r from-orange-600 to-purple-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm sm:text-base"
                  >
                    <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Grab This Spooky Deal!
                  </motion.button>

                  <button
                    onClick={handleClose}
                    className="w-full border-2 border-orange-200 dark:border-purple-600 text-orange-600 dark:text-orange-400 py-1 sm:py-2 rounded-lg sm:rounded-xl font-medium hover:bg-orange-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer text-sm sm:text-base"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-2 sm:p-4 bg-orange-50 dark:bg-orange-900/20 text-center">
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                  <FiGift className="w-2 h-2 sm:w-3 sm:h-3" />
                  {`Limited time Halloween special - Don't miss out!`}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-white dark:bg-gray-800 rounded-full p-1 sm:p-2 shadow-lg border-2 border-orange-300 dark:border-purple-600 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              <FiX className="w-3 h-3 sm:w-5 sm:h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HalloweenAdvertisement;
