"use client";

import { DEFAULT_LIMIT } from "@/constants/constants";
import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { FiArrowRight, FiStar, FiUsers } from "react-icons/fi";
import TrendingNowSkeleton from "./trending-now-skeleton";
import { ErrorBoundary } from "react-error-boundary";

export type PromotionFromDB = {
  id: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  url: string | null;
  retailer: string;
  calculatedPrice: string;
  quantity: number;
  badge: "BESTSELLER" | "LIMITED" | "POPULAR" | "NEW" | null;
  createdAt: Date;
  recentBuyers?: { name: string }[]; // optional field for buyers
};

export const TrendingNow: React.FC = () => {
  return (
    <Suspense fallback={<TrendingNowSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <TrendingNowSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const Badge = ({ type }: { type: PromotionFromDB["badge"] }) => {
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

const RecentBuyers = ({ buyers }: { buyers: { name: string }[] }) => {
  const [speed, setSpeed] = useState<number>(50);

  useEffect(() => {
    setSpeed(Math.floor(Math.random() * 90) + 10);
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
          // eslint-disable-next-line @next/next/no-img-element
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
      <div className="ml-2 text-xs text-gray-600 dark:text-gray-300 flex items-center">
        <FiUsers className="inline mr-1" />
        {buyers.length}+ recently bought
      </div>
    </motion.div>
  );
};

export default function TrendingNowSuspense() {
  const [data] =
    trpc.getAdminItems.getAllTrendingItems.useSuspenseInfiniteQuery(
      { limit: DEFAULT_LIMIT },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  // Flatten pages into one array
  const promotions: PromotionFromDB[] =
    data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative py-16 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
            Weekly Specials
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Limited-time offers on authentic Sri Lankan products
          </p>
        </motion.div>

        {/* Promotions grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {promotions.map((promo) => (
              <motion.div
                key={promo.id}
                whileHover="hover"
                className="group"
                layout
              >
                <motion.a
                  href={promo.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Image */}
                  <div className="relative w-full py-2 flex justify-center items-center overflow-hidden">
                    <motion.img
                      src={promo.image}
                      alt={promo.name}
                      className="w-1/2  object-cover"
                      loading="lazy"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder-food.jpg";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge type={promo.badge} />
                    </div>
                  </div>

                  {/* Details */}
                  <motion.div className="p-5">
                    <h3 className="text-lg font-bold dark:text-white line-clamp-2">
                      {promo.name}
                    </h3>

                    {/* Rating */}
                    {promo.rating && (
                      <div className="flex items-center mt-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(promo.rating!)
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({promo.rating})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        {LkrFormat(
                          Number(promo.calculatedPrice ?? promo.price)
                        )}
                      </span>
                      {promo.calculatedPrice &&
                        promo.calculatedPrice !== promo.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {LkrFormat(Number(promo.price))}
                          </span>
                        )}
                    </div>

                    {/* Recent buyers */}
                    <RecentBuyers
                      buyers={
                        promo.recentBuyers ?? [
                          { name: "Kamal" },
                          { name: "Nimal" },
                          { name: "Sunil" },
                        ]
                      }
                    />

                    {/* Retailer */}
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {promo.retailer}
                      </span>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center">
                        View offer <FiArrowRight className="ml-1" />
                      </span>
                    </div>
                  </motion.div>
                </motion.a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        {/*         <motion.div variants={fadeIn("up", 0.5)} className="mt-16 text-center">
          <motion.a
            href="/promotions"
            className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white rounded-lg font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Special Offers
            <FiArrowRight className="ml-2" />
          </motion.a>
        </motion.div> */}
      </div>
    </motion.section>
  );
}
