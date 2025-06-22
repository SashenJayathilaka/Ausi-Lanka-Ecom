"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface ShippingCountdownProps {
  targetDate: string; // ISO date string
}

const ShippingCountdown: React.FC<ShippingCountdownProps> = ({
  targetDate,
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
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-black text-2xl font-bold">📦 Next Shipping In:</h2>
      <div className="flex gap-4">
        {formatUnit("Days", timeLeft.days)}
        {formatUnit("Hours", timeLeft.hours)}
        {formatUnit("Minutes", timeLeft.minutes)}
        {formatUnit("Seconds", timeLeft.seconds)}
      </div>
    </div>
  );
};

export default ShippingCountdown;
