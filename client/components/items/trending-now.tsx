/* eslint-disable @next/next/no-img-element */
"use client";

import { LkrFormat } from "@/utils/format";
import { fadeIn } from "@/utils/motion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight, FiClock, FiStar, FiUsers } from "react-icons/fi";

type Promotion = {
  id: string;
  title: string;
  price: number;
  image: string;
  url: string;
  retailer: string;
  originalPrice?: number;
  badge?: "BESTSELLER" | "LIMITED" | "POPULAR" | "NEW";
  rating?: number;
  timeLeft?: string;
  recentBuyers?: { name: string; avatar: string }[];
};

const trendingPromotions: Promotion[] = [
  {
    id: "1",
    title: "Premium Ceylon Tea (500g)",
    price: 2499,
    originalPrice: 2999,
    badge: "BESTSELLER",
    rating: 4.8,
    timeLeft: "2 days left",
    image:
      "https://scownspharmacy.com.au/cdn/shop/products/SWISSEUL_BVITC_MANHONCHEW120TAB_1.jpg?v=1635946295",
    url: "/promotions/ceylon-tea",
    retailer: "Ausi.Lk",
    recentBuyers: [
      { name: "Kamal", avatar: "/avatars/1.jpg" },
      { name: "Nimal", avatar: "/avatars/2.jpg" },
      { name: "Sunil", avatar: "/avatars/3.jpg" },
    ],
  },
  {
    id: "2",
    title: "Authentic Kottu Roti Kit",
    price: 1895,
    originalPrice: 2295,
    badge: "LIMITED",
    rating: 4.5,
    timeLeft: "1 day left",
    image:
      "https://scownspharmacy.com.au/cdn/shop/products/SWISSEUL_BVITC_MANHONCHEW120TAB_1.jpg?v=1635946295",
    url: "/promotions/kottu-roti-kit",
    retailer: "Ausi.Lk",
    recentBuyers: [
      { name: "Priya", avatar: "/avatars/4.jpg" },
      { name: "Saman", avatar: "/avatars/5.jpg" },
    ],
  },
  {
    id: "3",
    title: "Traditional Hoppers (6 Pack)",
    price: 1499,
    originalPrice: 1799,
    rating: 4.2,
    image:
      "https://scownspharmacy.com.au/cdn/shop/products/SWISSEUL_BVITC_MANHONCHEW120TAB_1.jpg?v=1635946295",
    url: "/promotions/hoppers-pack",
    retailer: "Ausi.Lk",
    recentBuyers: [
      { name: "Anil", avatar: "/avatars/6.jpg" },
      { name: "Mala", avatar: "/avatars/7.jpg" },
      { name: "Raj", avatar: "/avatars/8.jpg" },
    ],
  },
  {
    id: "4",
    title: "String Hopper Bundle",
    price: 1299,
    originalPrice: 1599,
    badge: "POPULAR",
    rating: 4.7,
    timeLeft: "3 days left",
    image:
      "https://scownspharmacy.com.au/cdn/shop/products/SWISSEUL_BVITC_MANHONCHEW120TAB_1.jpg?v=1635946295",
    url: "/promotions/string-hopper-bundle",
    retailer: "Ausi.Lk",
    recentBuyers: [
      { name: "Lakshmi", avatar: "/avatars/9.jpg" },
      { name: "Dinesh", avatar: "/avatars/10.jpg" },
    ],
  },
];

const Badge = ({ type }: { type: Promotion["badge"] }) => {
  const colors = {
    BESTSELLER: "bg-amber-500 text-white",
    LIMITED: "bg-red-500 text-white",
    POPULAR: "bg-blue-500 text-white",
    NEW: "bg-green-500 text-white",
  };

  return type ? (
    <motion.span
      className={`text-xs font-bold px-2 py-1 rounded-full ${colors[type]}`}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {type}
    </motion.span>
  ) : null;
};

const RecentBuyers = ({ buyers }: { buyers: Promotion["recentBuyers"] }) => {
  const [speed, setSpeed] = useState<number>();

  useEffect(() => {
    setSpeed(Math.floor(Math.random() * 90) + 10); // Generates a number between 10 and 99
  }, []);

  if (!buyers || buyers.length === 0) return null;

  return (
    <motion.div
      className="flex items-center mt-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex -space-x-2">
        {buyers.slice(0, 3).map((buyer, index) => (
          <img
            key={index}
            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
            src={`https://ui-avatars.com/api/?name=${buyer.name}&background=random&size=256&rounded=true&bold=true&color=fff&font-size=0.5&length=1&speed=${speed}`}
            alt={buyer.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/avatars/default.jpg";
            }}
          />
        ))}
      </div>
      <div className="ml-2 text-xs text-gray-600 dark:text-gray-300">
        <FiUsers className="inline mr-1" />
        {buyers.length}+ recently bought
      </div>
    </motion.div>
  );
};

export default function TrendingNow() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative py-16 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 mt-20"
    >
      {/* Background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
            transition: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
          className="absolute top-20 left-10 w-40 h-40 rounded-full bg-amber-200/30 dark:bg-amber-900/20 blur-xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
            transition: { duration: 25, repeat: Infinity, ease: "linear" },
          }}
          className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-amber-100/50 dark:bg-amber-800/20 blur-xl opacity-15"
        />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold dark:text-white relative inline-block mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -inset-2 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg -rotate-2 -z-10"
            />
            <span className="relative">Weekly Specials</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Limited-time offers on authentic Sri Lankan products
          </motion.p>
        </motion.div>

        {/* Promotions grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {trendingPromotions.map((promo) => (
              <motion.div
                key={promo.id}
                whileHover="hover"
                className="group"
                layout
              >
                <motion.a
                  href={promo.url}
                  className="block h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/20 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Image container */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <motion.img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder-food.jpg";
                      }}
                    />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
                      <Badge type={promo.badge} />
                    </div>

                    {/* Bottom badges */}
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      {promo.timeLeft && (
                        <motion.div
                          className="flex items-center bg-black/70 text-white text-xs px-2 py-1 rounded"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <FiClock className="mr-1" />
                          {promo.timeLeft}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <motion.div
                    className="p-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-lg font-bold dark:text-white line-clamp-2">
                      {promo.title}
                    </h3>

                    {/* Rating */}
                    {promo.rating && (
                      <motion.div
                        className="flex items-center mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(promo.rating!) ? "fill-current" : ""}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({promo.rating})
                        </span>
                      </motion.div>
                    )}

                    {/* Price */}
                    <motion.div
                      className="mt-3 flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        {LkrFormat(promo.price)}
                      </span>
                      {promo.originalPrice && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {LkrFormat(promo.originalPrice)}
                        </span>
                      )}
                    </motion.div>

                    {/* Recent buyers */}
                    {promo.recentBuyers && (
                      <RecentBuyers buyers={promo.recentBuyers} />
                    )}

                    {/* Retailer */}
                    <motion.div
                      className="mt-4 flex justify-between items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {promo.retailer}
                      </span>
                      <motion.span
                        className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center"
                        whileHover={{ x: 3 }}
                      >
                        View offer <FiArrowRight className="ml-1" />
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </motion.a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeIn("up", 0.5)} className="mt-16 text-center">
          <motion.a
            href="/promotions"
            className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white rounded-lg font-medium shadow-lg hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Special Offers
            <FiArrowRight className="ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}
