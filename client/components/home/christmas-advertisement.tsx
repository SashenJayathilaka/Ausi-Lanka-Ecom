"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiGift,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface Advertisement {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  bgColor: string;
}

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

const scaleIn = (delay: number): Variants => ({
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
      delay: delay,
    },
  },
});

const ChristmasAdvertisement = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Advertisement posters - Protein Oat Bars with Christmas theme
  const advertisements: Advertisement[] = [
    {
      id: 1,
      title: "Dark Chocolate",
      subtitle: "🎄 Christmas Pre-Order Special",
      description:
        "Protein Oat Bars Dark Choc 5 Pack 200g - Rich dark chocolate goodness! Pre-order now at Rs 1,300 (Save Rs 200!) Perfect holiday gift!",
      imageUrl: "/assets/dark.jpg",
      ctaText: "Pre-Order Now - Rs 1,300",
      ctaLink: "/catalog",
      badge: "🎅 SAVE Rs 200",
      bgColor: "from-red-600 to-green-600",
    },
    {
      id: 2,
      title: "Peanut Butter",
      subtitle: "🎁 Holiday Special Offer",
      description:
        "Protein Oat Bars Peanut Butter 5 Pack 200g - Delicious peanut butter protein bars! Only Rs 1,300 (Save Rs 200!) Great Christmas gift!",
      imageUrl: "/assets/Protein.jpg",
      ctaText: "Order Now - Rs 1,300",
      ctaLink: "/catalog",
      badge: "🎄 SAVE Rs 200",
      bgColor: "from-green-600 to-red-600",
    },
    {
      id: 3,
      title: "Choc Chip Coconut",
      subtitle: "⛄ Winter Delicious Special",
      description:
        "Hillcrest 200g Chocolate Chip Coconut Protein Oat Bars - Irresistible flavor! Only Rs 1,300 (Save Rs 200!) Perfect for active lifestyle!",
      imageUrl: "/assets/chip.jpg",
      ctaText: "Get Yours - Rs 1,300",
      ctaLink: "/catalog",
      badge: "❄️ SAVE Rs 200",
      bgColor: "from-red-700 to-green-700",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % advertisements.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? advertisements.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentAd = advertisements[currentSlide];

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-red-50 via-green-50 to-red-50 dark:from-gray-900 dark:via-red-950 dark:to-gray-900">
      {/* Christmas decorative elements */}
      <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-20">
        🎄
      </div>
      <div className="absolute top-20 right-20 text-5xl animate-pulse opacity-20">
        🎅
      </div>
      <div className="absolute bottom-20 left-20 text-5xl animate-bounce opacity-20 animation-delay-1000">
        🎁
      </div>
      <div className="absolute bottom-10 right-10 text-6xl animate-pulse opacity-20 animation-delay-2000">
        ⛄
      </div>

      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container mx-auto relative"
      >
        {/* Section Header */}
        <motion.div variants={fadeIn("up", 0.2)} className="text-center mb-12">
          <motion.div
            variants={fadeIn("up", 0.1)}
            className="inline-flex items-center gap-2 mb-4"
          >
            <motion.span
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="text-3xl"
            >
              🎄
            </motion.span>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              Merry Christmas
            </span>
            <motion.span
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="text-3xl"
            >
              🎅
            </motion.span>
          </motion.div>

          <motion.h2
            variants={fadeIn("up", 0.3)}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 via-green-600 to-red-600 dark:from-red-400 dark:via-green-400 dark:to-red-400 bg-clip-text text-transparent"
          >
            Holiday Special Offers 🎁
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Celebrate the season with our delicious protein oat bars - the
            perfect gift for health-conscious loved ones! ❄️
          </motion.p>
        </motion.div>

        {/* Main Advertisement Carousel */}
        <motion.div
          variants={scaleIn(0.3)}
          className="relative max-w-7xl mx-auto"
        >
          {/* Main Poster Display */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group border-4 border-red-200 dark:border-red-800">
            {/* Background Image with Overlay */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src={currentAd.imageUrl}
                alt={currentAd.title}
                fill
                className="object-contain transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Christmas Gradient Overlay - Lighter for better visibility */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentAd.bgColor} opacity-20 mix-blend-multiply`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Christmas elements on poster */}
              <motion.div
                className="absolute top-10 left-10 text-4xl"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ⭐
              </motion.div>
              <motion.div
                className="absolute top-10 right-10 text-4xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                🔔
              </motion.div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
              {/* Badge */}
              {currentAd.badge && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-red-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-red-300">
                    <FiGift className="animate-pulse" />
                    {currentAd.badge}
                  </span>
                </motion.div>
              )}

              {/* Title and Subtitle */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                {currentAd.subtitle && (
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-300 mb-2 drop-shadow-lg">
                    {currentAd.subtitle}
                  </p>
                )}
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 drop-shadow-2xl">
                  {currentAd.title}
                </h3>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-white/95 mb-6 max-w-2xl drop-shadow-lg"
              >
                {currentAd.description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href={currentAd.ctaLink}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-red-500 to-green-600 hover:from-red-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center gap-3 group border-2 border-white"
                  >
                    <FiGift className="animate-bounce" />
                    {currentAd.ctaText}
                    <FiExternalLink
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-500/80 backdrop-blur-sm hover:bg-red-600/90 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Previous slide"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500/80 backdrop-blur-sm hover:bg-green-600/90 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Next slide"
            >
              <FiChevronRight size={24} />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-3 mt-8">
            {advertisements.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-12 h-3 bg-gradient-to-r from-red-500 to-green-500"
                    : "w-3 h-3 bg-red-300 dark:bg-red-700 hover:bg-red-400 dark:hover:bg-red-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Thumbnail Grid */}
        <motion.div
          variants={fadeIn("up", 0.6)}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12"
        >
          {advertisements.map((ad, index) => (
            <motion.button
              key={ad.id}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`relative rounded-xl overflow-hidden group ${
                index === currentSlide
                  ? "ring-4 ring-red-500 dark:ring-green-500 shadow-2xl"
                  : "opacity-70 hover:opacity-100"
              } transition-all duration-300`}
            >
              <div className="relative h-32 md:h-40">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-contain"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${ad.bgColor} opacity-20 mix-blend-multiply`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-end p-3">
                <p className="text-white font-bold text-sm md:text-base drop-shadow-lg">
                  {ad.title}
                </p>
              </div>
              {ad.badge && (
                <div className="absolute top-2 right-2">
                  <span className="bg-white/95 backdrop-blur-sm text-red-700 px-2 py-1 rounded text-xs font-bold shadow-lg">
                    {ad.badge}
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Christmas Message */}
        <motion.div
          variants={fadeIn("up", 0.8)}
          className="mt-12 text-center bg-gradient-to-r from-red-100 to-green-100 dark:from-red-950 dark:to-green-950 rounded-2xl p-8 border-2 border-red-200 dark:border-red-800"
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="text-4xl">🎁</span>
            <h3 className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-400">
              Perfect Holiday Gift!
            </h3>
            <span className="text-4xl">🎄</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Give the gift of health this Christmas! Our protein oat bars make
            the perfect stocking stuffer or gift for fitness enthusiasts. Order
            now and spread the joy! 🎅✨
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ChristmasAdvertisement;
