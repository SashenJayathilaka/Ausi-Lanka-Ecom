import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const OrderHistoryPageSkeleton = () => {
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-200";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-12 text-center">
        <div className={`h-12 w-64 mx-auto ${bgColor} rounded-lg mb-4`} />
        <div className={`h-5 w-80 mx-auto ${bgColor} rounded`} />
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-8">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Order Header Skeleton */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-6 w-24 ${bgColor} rounded-full`} />
                    <div className={`h-5 w-32 ${bgColor} rounded`} />
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 ${bgColor} rounded-lg`} />
                    <div className="space-y-2">
                      <div className={`h-4 w-40 ${bgColor} rounded`} />
                      <div className={`h-3 w-32 ${bgColor} rounded`} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`h-7 w-24 ${bgColor} rounded ml-auto`} />
                  <div className={`h-4 w-32 ${bgColor} rounded ml-auto`} />
                </div>
              </div>
            </div>

            {/* Delivery Address Skeleton */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className={`h-5 w-40 ${bgColor} rounded mb-4`} />
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <div className={`h-4 w-full ${bgColor} rounded`} />
                <div className={`h-4 w-3/4 ${bgColor} rounded`} />
                <div className={`h-4 w-48 ${bgColor} rounded mt-3`} />
              </div>
            </div>

            {/* Order Items Skeleton */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className={`h-5 w-40 ${bgColor} rounded mb-4`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div
                      className={`flex-shrink-0 w-16 h-16 ${bgColor} rounded-md`}
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className={`h-4 w-3/4 ${bgColor} rounded`} />
                      <div className={`h-3 w-1/2 ${bgColor} rounded`} />
                      <div className={`h-3 w-1/3 ${bgColor} rounded`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Progress Skeleton */}
            <div className="p-6">
              <div className={`h-5 w-40 ${bgColor} rounded mb-4`} />

              {/* Progress Bar Skeleton */}
              <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
                <div
                  className={`absolute top-0 left-0 h-full ${bgColor} w-3/4`}
                />
              </div>

              {/* Progress Steps Skeleton */}
              <div className="flex justify-between">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col items-center w-full"
                  >
                    <div className={`h-8 w-8 ${bgColor} rounded-full mb-2`} />
                  </div>
                ))}
              </div>

              {/* Delivery Info Skeleton */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 ${bgColor} rounded-lg`} />
                  <div className="space-y-2">
                    <div className={`h-4 w-32 ${bgColor} rounded`} />
                    <div className={`h-3 w-48 ${bgColor} rounded`} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="pt-6 text-center">
        <div className={`h-12 w-40 mx-auto ${bgColor} rounded-xl`} />
      </div>
    </div>
  );
};

export default OrderHistoryPageSkeleton;
