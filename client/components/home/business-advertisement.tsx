"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiTag,
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

const BusinessAdvertisement = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Advertisement posters - Protein Oat Bars
  const advertisements: Advertisement[] = [
    {
      id: 1,
      title: "Dark Chocolate",
      subtitle: "🍫 Pre-Order Special",
      description:
        "Protein Oat Bars Dark Choc 5 Pack 200g - Rich dark chocolate goodness in every bite. Pre-order now at Rs 1,300 (Save Rs 200 from original Rs 1,500)!",
      imageUrl: "/assets/dark.jpg",
      ctaText: "Pre-Order - Rs 1,300",
      ctaLink: "/catalog",
      badge: "SAVE Rs 200",
      bgColor: "from-amber-500 to-orange-600",
    },
    {
      id: 2,
      title: "Peanut Butter",
      subtitle: "🥜 Special Offer",
      description:
        "Protein Oat Bars Peanut Butter 5 Pack 200g - Delicious peanut butter protein bars packed with nutrients. Only Rs 1,300 (Save Rs 200 from Rs 1,500)!",
      imageUrl: "/assets/Protein.jpg",
      ctaText: "Order Now - Rs 1,300",
      ctaLink: "/catalog",
      badge: "SAVE Rs 200",
      bgColor: "from-blue-500 to-cyan-600",
    },
    {
      id: 3,
      title: "Choc Chip Coconut",
      subtitle: "🥥 Limited Time",
      description:
        "Hillcrest 200g Chocolate Chip Coconut Protein Oat Bars - Irresistible chocolate chip coconut flavor. Only Rs 1,300 (Save Rs 200 from Rs 1,500)!",
      imageUrl: "/assets/chip.jpg",
      ctaText: "Get Yours - Rs 1,300",
      ctaLink: "/catalog",
      badge: "SAVE Rs 200",
      bgColor: "from-purple-600 to-pink-600",
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
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container mx-auto"
      >
        {/* Section Header */}
        <motion.div variants={fadeIn("up", 0.2)} className="text-center mb-12">
          <motion.h2
            variants={fadeIn("up", 0.3)}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
          >
            Special Offers & Promotions
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Don&apos;t miss out on our exclusive deals and limited-time offers
          </motion.p>
        </motion.div>

        {/* Main Advertisement Carousel */}
        <motion.div
          variants={scaleIn(0.3)}
          className="relative max-w-7xl mx-auto"
        >
          {/* Main Poster Display */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            {/* Background Image with Overlay */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src={currentAd.imageUrl}
                alt={currentAd.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentAd.bgColor} opacity-75 mix-blend-multiply`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
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
                  <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    <FiTag />
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
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-400 mb-2">
                    {currentAd.subtitle}
                  </p>
                )}
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 drop-shadow-lg">
                  {currentAd.title}
                </h3>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl"
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
                    className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center gap-3 group"
                  >
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
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
                    ? "w-12 h-3 bg-gradient-to-r from-blue-500 to-purple-500"
                    : "w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Thumbnail Grid */}
        <motion.div
          variants={fadeIn("up", 0.6)}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          {advertisements.map((ad, index) => (
            <motion.button
              key={ad.id}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative rounded-xl overflow-hidden group ${
                index === currentSlide
                  ? "ring-4 ring-blue-500 shadow-xl"
                  : "opacity-60 hover:opacity-100"
              } transition-all duration-300`}
            >
              <div className="relative h-32 md:h-40">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${ad.bgColor} opacity-60 mix-blend-multiply`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-end p-3">
                <p className="text-white font-bold text-sm md:text-base drop-shadow-lg">
                  {ad.title}
                </p>
              </div>
              {ad.badge && (
                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded text-xs font-bold">
                    {ad.badge}
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BusinessAdvertisement;
