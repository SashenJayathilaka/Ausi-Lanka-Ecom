import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiStar } from "react-icons/fi";

const TrendingNowSkeleton = () => {
  const skeletonItems = Array(4).fill(null);
  return (
    <div className="relative py-16 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4"></div>
          <div className="h-5 w-80 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto"></div>
        </div>

        {/* Promotions grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skeletonItems.map((_, index) => (
            <motion.div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Image skeleton */}
              <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 flex justify-center items-center">
                <div className="w-1/2 h-32 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              </div>

              {/* Details skeleton */}
              <div className="p-5">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>

                {/* Rating skeleton */}
                <div className="flex items-center mt-2">
                  <div className="flex text-gray-300 dark:text-gray-600">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4" />
                    ))}
                  </div>
                  <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded ml-1"></div>
                </div>

                {/* Price skeleton */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                {/* Recent buyers skeleton */}
                <div className="flex items-center mt-3">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800"
                      ></div>
                    ))}
                  </div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-2"></div>
                </div>

                {/* Retailer skeleton */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center">
                    <FiArrowRight className="ml-1 text-gray-300 dark:text-gray-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingNowSkeleton;
