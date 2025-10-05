// components/AdvertisementSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiRefreshCw,
} from "react-icons/fi";

interface AdvertisementSectionProps {
  videoUrl?: string;
}

// Animation variants similar to your testimonials section
const staggerContainer = (
  staggerChildren?: number,
  delayChildren?: number
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0,
    },
  },
});

const fadeIn = (direction: string, delay: number): Variants => ({
  hidden: {
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    opacity: 0,
  },
  show: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.8,
      delay: delay,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  },
});

const textVariant = (delay: number): Variants => ({
  hidden: {
    y: 50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25,
      delay: delay,
    },
  },
});

const AdvertisementSection = ({
  videoUrl = "https://www.youtube.com/embed/GRmN18eHbB8?autoplay=1&mute=1&controls=0",
}: AdvertisementSectionProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);
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

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    setHasInteracted(true);
  };

  const videoVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    show: {
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

  // Construct video URL with parameters including loop
  const getVideoUrl = () => {
    const url = new URL(videoUrl);
    url.searchParams.set("autoplay", isPlaying ? "1" : "0");
    url.searchParams.set("mute", isMuted ? "1" : "0");
    url.searchParams.set("loop", isLooping ? "1" : "0");

    // For loop to work properly, we also need playlist parameter with the same video ID
    if (isLooping) {
      const videoId = url.pathname.split("/").pop();
      url.searchParams.set("playlist", videoId!);
    }

    return url.toString();
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-gray-800">
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container mx-auto relative"
      >
        {/* Section header */}
        <motion.div variants={fadeIn("up", 0.3)} className="text-center mb-16">
          <motion.span
            variants={fadeIn("up", 0.2)}
            className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4 transition-colors duration-500"
          >
            Featured Video
          </motion.span>
          <motion.h2
            variants={textVariant(0.3)}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-500"
          >
            Discover{" "}
            <span className="text-blue-600 dark:text-blue-400 transition-colors duration-500">
              AUSI.lk
            </span>
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500"
          >
            {`Watch how we're revolutionizing business solutions and helping
            entrepreneurs achieve their goals`}
          </motion.p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          variants={videoVariants}
          className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 max-w-6xl mx-auto"
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

            {/* Loop Toggle Button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={toggleLoop}
              className={`p-3 rounded-full backdrop-blur-sm shadow-lg ${
                isLooping
                  ? "bg-blue-500/80 text-white"
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white"
              }`}
              aria-label={isLooping ? "Disable loop" : "Enable loop"}
            >
              <FiRefreshCw
                size={20}
                className={isLooping ? "text-white" : ""}
              />
            </motion.button>
          </div>

          {/* Video Status Indicator */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <motion.div
              className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                isPlaying
                  ? "bg-green-500/20 text-green-700 dark:text-green-300"
                  : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {isPlaying ? "Playing" : "Paused"}
            </motion.div>

            {isLooping && (
              <motion.div
                className="px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-blue-500/20 text-blue-700 dark:text-blue-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                Loop On
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div variants={fadeIn("up", 0.6)} className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Advertisement • AUSI.lk Business Platform
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AdvertisementSection;
