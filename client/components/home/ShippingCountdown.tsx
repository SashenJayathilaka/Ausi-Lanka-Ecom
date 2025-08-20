"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiPackage } from "react-icons/fi";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface ShippingCountdownProps {
  isSmall?: boolean;
  className?: string;
}

const ShippingCountdown = ({ className, isSmall }: ShippingCountdownProps) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <ShippingCountdownSuspenses isSmall={isSmall} className={className} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
      Failed to load shipment data
    </div>
  </div>
);

const ShippingCountdownSuspenses: React.FC<ShippingCountdownProps> = ({
  isSmall,
  className,
}) => {
  const { data: targetDate } = trpc.getNextShipmentRouter.getNext.useQuery(
    undefined,
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date();
    const difference =
      +new Date(targetDate?.shipmentDate || "2025-07-30T10:00:00") - +now;
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft, targetDate]);

  // 🔹 Calculate Estimated Delivery Date (shipmentDate + 65 days)
  const estimatedDeliveryDate = new Date(
    new Date(targetDate?.shipmentDate || "2025-07-30T10:00:00").setDate(
      new Date(targetDate?.shipmentDate || "2025-07-30T10:00:00").getDate() + 65
    )
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatUnit = (label: string, value: number) => (
    <>
      {isSmall ? (
        <motion.div
          key={label}
          className="relative bg-white dark:bg-gray-800 rounded-xl p-3 w-24 h-28 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700 overflow-hidden group transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{
            scale: 1.03,
            borderColor: "rgba(99,102,241,0.3)",
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/40 to-indigo-50/0 dark:via-indigo-900/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%", transition: { duration: 1.2 } }}
          />

          <motion.div
            key={value}
            className="relative z-10 text-4xl font-bold text-indigo-600 dark:text-indigo-400 font-mono transition-colors duration-300"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
          >
            {value.toString().padStart(2, "0")}
          </motion.div>

          <motion.div
            className="relative z-10 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-2 font-medium transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {label}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key={label}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            key={value}
            className="bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center transition-colors duration-300"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xl font-bold text-white font-mono">
              {value.toString().padStart(2, "0")}
            </span>
          </motion.div>
          <span className="text-xs text-blue-100 dark:text-blue-300 mt-1 uppercase tracking-wider transition-colors duration-300">
            {label}
          </span>
        </motion.div>
      )}
    </>
  );

  return (
    <>
      {isSmall ? (
        <div className="relative py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white dark:from-gray-900 to-white/0 dark:to-gray-900/0 z-10 pointer-events-none transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-white/0 dark:to-gray-900/0 z-10 pointer-events-none transition-colors duration-500" />

          <motion.div
            className="relative overflow-y-auto py-8 px-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                >
                  <FiPackage className="h-6 w-6 text-indigo-500 dark:text-indigo-400 transition-colors duration-300" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                  Next Shipping Dispatch
                </h2>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {formatUnit("Days", timeLeft.days)}
                {formatUnit("Hrs", timeLeft.hours)}
                {formatUnit("Min", timeLeft.minutes)}
                {formatUnit("Sec", timeLeft.seconds)}
              </motion.div>

              <div className="w-full max-w-md relative h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-6 overflow-hidden transition-colors duration-300">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-indigo-400 dark:bg-indigo-500 rounded-full transition-colors duration-300"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 1.5,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </div>

              {/*               <motion.div
                className="text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Orders placed in{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                  {timeLeft.hours}h {timeLeft.minutes}m
                </span>{" "}
                will ship today
              </motion.div> */}

              {/* 🔹 Estimated Delivery Section */}
              <motion.div
                className="text-center mt-6 transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="inline-block bg-indigo-100 dark:bg-indigo-900 px-6 py-3 rounded-2xl shadow-md">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Estimated Delivery:
                  </p>
                  <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 block mt-1">
                    {estimatedDeliveryDate}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          className={`flex flex-wrap items-center gap-3 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiClock className="h-5 w-5 text-blue-200 dark:text-blue-400 transition-colors duration-300" />
          <span className="text-sm text-blue-100 dark:text-blue-300 font-medium transition-colors duration-300">
            Next shipping batch closes in:
          </span>

          <div className="flex flex-wrap gap-2 ml-2">
            {timeLeft.days > 0 && formatUnit("Days", timeLeft.days)}
            {formatUnit("Hrs", timeLeft.hours)}
            {formatUnit("Min", timeLeft.minutes)}
            {formatUnit("Sec", timeLeft.seconds)}
          </div>

          {/* 🔹 Estimated Delivery Section */}
          <div className="w-full sm:w-auto mt-2 sm:mt-0 ml-0 sm:ml-4">
            <span className="text-sm sm:text-base text-blue-200 dark:text-blue-300 font-medium transition-colors duration-300">
              Estimated Delivery:
            </span>
            <span className="block text-lg sm:text-xl font-extrabold text-white dark:text-indigo-300 mt-1">
              {estimatedDeliveryDate}
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ShippingCountdown;
