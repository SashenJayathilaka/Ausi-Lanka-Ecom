"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/utils/motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiArrowRight,
  FiPackage,
  FiShoppingCart,
  FiMonitor,
  FiGift,
  FiHome,
  FiHeart,
  FiTruck,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const CategorySection = () => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const categories = [
    {
      id: "pharmacy",
      title: "Pharmacy",
      description: "Health & Wellness",
      image:
        "https://images.pexels.com/photos/208518/pexels-photo-208518.jpeg?auto=compress&cs=tinysrgb&w=800",
      icon: FiActivity,
      link: "/catalog?category=pharmacy",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgPattern: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      id: "supermarket",
      title: "Supermarket",
      description: "Daily Essentials",
      image:
        "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800",
      icon: FiShoppingCart,
      link: "/catalog?category=supermarket",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgPattern: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      id: "electronics",
      title: "Electronics",
      description: "Latest Gadgets",
      image:
        "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800",
      icon: FiMonitor,
      link: "/catalog?category=electronics",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgPattern: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      id: "gifts",
      title: "Gifts",
      description: "Special Moments",
      image:
        "https://images.pexels.com/photos/264869/pexels-photo-264869.jpeg?auto=compress&cs=tinysrgb&w=800",
      icon: FiGift,
      link: "/catalog?category=gifts",
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgPattern: "bg-pink-50 dark:bg-pink-950/30",
    },
    {
      id: "home-kitchen",
      title: "Home & Kitchen",
      description: "Modern Living",
      image:
        "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
      icon: FiHome,
      link: "/catalog?category=home-kitchen",
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      bgPattern: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      id: "beauty",
      title: "Beauty",
      description: "Personal Care",
      image:
        "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800",
      icon: FiHeart,
      link: "/catalog?category=beauty",
      gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
      bgPattern: "bg-rose-50 dark:bg-rose-950/30",
    },
    {
      id: "toys",
      title: "Toys & Games",
      description: "Fun for Kids",
      image:
        "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800",
      icon: FiPackage,
      link: "/catalog?category=toys",
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      bgPattern: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      id: "sports",
      title: "Sports",
      description: "Active Lifestyle",
      image:
        "https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=800",
      icon: FiTruck,
      link: "/catalog?category=sports",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bgPattern: "bg-cyan-50 dark:bg-cyan-950/30",
    },
  ];

  const handleImageError = (categoryId: string) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
  };

  return (
    <motion.section
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="w-full bg-white dark:bg-gray-900 py-20 transition-colors duration-500 relative overflow-hidden"
    >
      {/* Background decoration matching other sections */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-20 -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeIn("up", 0.2)} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-lg">
              Explore Our Collection
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
            Shop by{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover premium Australian products across our carefully curated
            categories
          </p>
        </motion.div>

        {/* Horizontal Scroll Container with Navigation */}
        <div className="relative group/scroll">
          {/* Left Arrow */}
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 shadow-xl rounded-full flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 hover:scale-110 transform -translate-x-1/2"
              aria-label="Scroll left"
            >
              <FiChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </motion.button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 shadow-xl rounded-full flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 hover:scale-110 transform translate-x-1/2"
              aria-label="Scroll right"
            >
              <FiChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </motion.button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4 px-1"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const hasError = imageErrors[category.id];

              return (
                <motion.div
                  key={category.id}
                  variants={fadeIn("up", 0.05 * (index + 1))}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(category.link)}
                  className="group cursor-pointer relative flex-shrink-0 w-[200px] md:w-[240px] h-[260px] md:h-[300px] rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 snap-start"
                >
                  {/* Background Image */}
                  {!hasError && (
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        onError={() => handleImageError(category.id)}
                        priority={index < 4}
                      />
                    </div>
                  )}

                  {/* Background Pattern (fallback) */}
                  <div className={`absolute inset-0 ${category.bgPattern}`} />

                  {/* Animated Gradient Background - blend with image */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} ${
                      hasError ? "opacity-90" : "opacity-60"
                    } group-hover:opacity-70 transition-all duration-500 mix-blend-multiply`}
                  />

                  {/* Dark overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />

                  {/* Gradient Mesh Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
                  </div>

                  {/* Icon Background Circle */}
                  <div className="absolute top-6 right-6 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content Container */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    {/* Top Badge */}
                    <div className="transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/30">
                        {category.description}
                      </span>
                    </div>

                    {/* Bottom Content */}
                    <div className="space-y-3">
                      <div className="transform translate-y-0 transition-all duration-500">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 drop-shadow-lg">
                          {category.title}
                        </h3>
                        <p className="text-white/90 text-sm font-medium mb-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
                          Premium collection
                        </p>
                      </div>

                      {/* Hover Action Button */}
                      <motion.div
                        className="flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"
                        whileHover={{ x: 5 }}
                      >
                        <span className="border-b-2 border-white pb-0.5">
                          Browse Now
                        </span>
                        <FiArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Shimmer Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Border Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-500" />
                </motion.div>
              );
            })}
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(categories.length / 3) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 transition-all duration-300"
                />
              )
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CategorySection;
