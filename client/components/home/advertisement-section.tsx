// components/AdvertisementSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";

interface AdvertisementSectionProps {
  videoUrl?: string;
}

const AdvertisementSection = ({
  videoUrl = "https://www.youtube.com/embed/GRmN18eHbB8?autoplay=1&mute=1&controls=0",
}: AdvertisementSectionProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  console.log("🚀 ~ AdvertisementSection ~ hasInteracted:", hasInteracted);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Detect dark mode from document class
  useEffect(() => {
    const checkDarkMode = () => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    };

    // Initial check
    checkDarkMode();

    // Observe for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setHasInteracted(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setHasInteracted(true);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const videoVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants: Variants = {
    hover: {
      scale: 1.05,
      backgroundColor: darkMode
        ? "rgba(75, 85, 99, 0.8)"
        : "rgba(229, 231, 235, 0.8)",
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const statusVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Construct video URL with parameters
  const getVideoUrl = () => {
    const url = new URL(videoUrl);
    url.searchParams.set("autoplay", isPlaying ? "1" : "0");
    url.searchParams.set("mute", isMuted ? "1" : "0");
    return url.toString();
  };

  return (
    <motion.section
      className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            variants={headerVariants}
          >
            Discover AUSI.lk
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            variants={headerVariants}
          >
            Experience the future of business with our innovative platform.
            Watch our featured advertisement to learn more.
          </motion.p>
        </div>

        {/* Video Container */}
        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700"
          variants={videoVariants}
        >
          {/* Video Player */}
          <div className="relative aspect-video w-full">
            <iframe
              src={getVideoUrl()}
              title="AUSI.lk Advertisement"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Controls Overlay */}
          <div className="absolute bottom-6 right-6 flex space-x-3">
            {/* Play/Pause Button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={togglePlay}
              className="p-3 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-lg"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
            </motion.button>

            {/* Mute/Unmute Button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={toggleMute}
              className="p-3 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-lg"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
            </motion.button>
          </div>

          {/* Video Status Indicator */}
          <div className="absolute top-4 left-4">
            <motion.div
              className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                isPlaying
                  ? "bg-green-500/20 text-green-700 dark:text-green-300"
                  : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
              }`}
              variants={statusVariants}
              initial="hidden"
              animate="visible"
            >
              {isPlaying ? "Playing" : "Paused"}
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div className="mt-8 text-center" variants={headerVariants}>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Advertisement • AUSI.lk Business Platform
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AdvertisementSection;
