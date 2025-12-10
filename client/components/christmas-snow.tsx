"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
  delay: number;
}

const ChristmasSnow = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate random snowflakes
    const flakes: Snowflake[] = [];
    const numberOfFlakes = 50; // Adjust for more/less snow

    for (let i = 0; i < numberOfFlakes; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100, // Random horizontal position (0-100%)
        animationDuration: Math.random() * 3 + 5, // Random fall speed (5-8 seconds)
        opacity: Math.random() * 0.6 + 0.4, // Random opacity (0.4-1)
        size: Math.random() * 10 + 5, // Random size (5-15px)
        delay: Math.random() * 5, // Random start delay
      });
    }

    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute text-white select-none"
          style={{
            left: `${flake.left}%`,
            top: -20,
            opacity: flake.opacity,
            fontSize: `${flake.size}px`,
          }}
          animate={{
            y: ["0vh", "100vh"],
            x: [0, Math.sin(flake.id) * 50, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: flake.animationDuration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
};

export default ChristmasSnow;
