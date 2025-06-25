"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface ShippingCountdownProps {
  targetDate: string; // ISO date string
  isSmall?: boolean;
  className?: string;
}

const ShippingCountdown: React.FC<ShippingCountdownProps> = ({
  targetDate,
  isSmall,
  className,
}) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date();
    const difference = +new Date(targetDate) - +now;
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

  const formatUnit = (label: string, value: number) => (
    <>
      {isSmall ? (
        <motion.div
          key={label}
          className="bg-white/10 rounded-xl px-4 py-3 w-24 text-center shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-semibold text-black font-mono"
          >
            {value.toString().padStart(2, "0")}
          </motion.div>
          <div className="text-sm text-gray-900 uppercase tracking-wider mt-1">
            {label}
          </div>
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
            className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xl font-bold text-white font-mono">
              {value.toString().padStart(2, "0")}
            </span>
          </motion.div>
          <span className="text-xs text-blue-100 mt-1 uppercase tracking-wider">
            {label}
          </span>
        </motion.div>
      )}
    </>
  );

  return (
    <>
      {isSmall ? (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-black text-2xl font-bold">
            📦 Next Shipping In:
          </h2>
          <div className="flex gap-4">
            {formatUnit("Days", timeLeft.days)}
            {formatUnit("Hours", timeLeft.hours)}
            {formatUnit("Minutes", timeLeft.minutes)}
            {formatUnit("Seconds", timeLeft.seconds)}
          </div>
        </div>
      ) : (
        <motion.div
          className={`flex items-center gap-3 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiClock className="h-5 w-5 text-blue-200" />
          <span className="text-sm text-blue-100 font-medium">
            Next shipping batch closes in:
          </span>
          <div className="flex gap-2 ml-2">
            {timeLeft.days > 0 && formatUnit("Days", timeLeft.days)}
            {formatUnit("Hrs", timeLeft.hours)}
            {formatUnit("Min", timeLeft.minutes)}
            {formatUnit("Sec", timeLeft.seconds)}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ShippingCountdown;
