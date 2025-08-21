/* eslint-disable @next/next/no-img-element */
"use client";

import { useCartStore } from "@/store/useCartStore";
import { LkrFormat } from "@/utils/format";
import { fadeIn } from "@/utils/motion";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiPackage,
  FiShoppingCart,
  FiGrid,
  FiHeart,
} from "react-icons/fi";
import { trpc } from "@/trpc/client";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  url?: string | null;
  retailer: string;
  quantity: number;
  location?: string | null;
  category?: string | null;
  description?: string | null;
  sku?: string;
  originalPrice?: string | null;
  threshold?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type TabType = "supermarket" | "pharmacy";

const AvailableInSriLanka = () => {
  const addProduct = useCartStore((state) => state.addProduct);
  const [supermarketProducts, setSupermarketProducts] = useState<Product[]>([]);
  const [pharmacyProducts, setPharmacyProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("supermarket");
  const [loading, setLoading] = useState(true);

  // Fetch products from your database
  const { data, error } = trpc.getAdminItems.getAllInStockItems.useQuery(
    { limit: 50 },
    { staleTime: 1000 * 60 * 5 }
  );

  useEffect(() => {
    if (data?.items) {
      // Filter supermarket products in Sri Lanka
      const supermarketItems = data.items.filter(
        (item: Product) =>
          item.location === "Sri Lanka" &&
          item.quantity > 0 &&
          item.isActive &&
          item.category?.toLowerCase() === "supermarket"
      );

      // Filter pharmacy products in Sri Lanka
      const pharmacyItems = data.items.filter(
        (item: Product) =>
          item.location === "Sri Lanka" &&
          item.quantity > 0 &&
          item.isActive &&
          item.category?.toLowerCase() === "pharmacy"
      );

      setSupermarketProducts(supermarketItems.slice(0, 8));
      setPharmacyProducts(pharmacyItems.slice(0, 8));
      setLoading(false);
    }
  }, [data]);

  const handleAddToCart = (product: Product) => {
    addProduct({
      name: product.name,
      price: product.price,
      image: product.image,
      url: product.url || "",
      retailer: product.retailer,
      calculatedPrice: product.price,
    });
  };

  const currentProducts =
    activeTab === "supermarket" ? supermarketProducts : pharmacyProducts;

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-red-800 dark:text-red-200 text-lg font-semibold mb-2">
              Failed to load products
            </h3>
            <p className="text-red-600 dark:text-red-300">
              Please try again later
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500 py-16">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-green-100/50 dark:bg-green-900/20 blur-xl opacity-20 dark:opacity-10"></div>
        <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-green-200/30 dark:bg-green-800/20 blur-xl opacity-15 dark:opacity-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-24"
      >
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.h2
            variants={fadeIn("up", 0.2)}
            className="text-3xl md:text-4xl font-bold dark:text-white"
          >
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-green-100/50 dark:bg-green-900/30 rounded-lg -rotate-2 -z-10"></span>
              <span className="relative">Available in Sri Lanka</span>
            </span>
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.3)}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Local favorites ready for immediate delivery
          </motion.p>
        </div>

        {/* Tabs */}
        <motion.div
          variants={fadeIn("up", 0.4)}
          className="flex justify-center mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("supermarket")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "supermarket"
                    ? "bg-green-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <FiGrid className="h-4 w-4" />
                Supermarket
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full ml-2">
                  {supermarketProducts.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("pharmacy")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "pharmacy"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <FiHeart className="h-4 w-4" />
                Pharmacy
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full ml-2">
                  {pharmacyProducts.length}
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Products grid */}
        {currentProducts.length === 0 ? (
          <motion.div
            variants={fadeIn("up", 0.5)}
            className="text-center py-12"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
              <FiPackage className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {activeTab} products available in Sri Lanka
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Check back later for {activeTab} inventory updates
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeIn("up", 0.5)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {currentProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/20 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                {/* Item image */}
                <div className="relative h-48 w-full bg-white">
                  <div className="flex justify-center items-center w-full">
                    <img
                      src={item.image || "/placeholder-product.jpg"}
                      alt={item.name}
                      className="w-1/2 h-48 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-product.jpg";
                      }}
                    />
                  </div>

                  {/* Stock and price tag */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-green-100 dark:bg-green-900/80 px-3 py-1 rounded-full shadow-sm text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-1">
                      <FiPackage className="h-3 w-3" />
                      {item.quantity} in stock
                    </div>
                    <div className="bg-white dark:bg-gray-900 px-3 py-1 rounded-full shadow-sm text-sm font-medium text-amber-600 dark:text-amber-400">
                      {LkrFormat(Number(item.price))}
                    </div>
                  </div>
                </div>

                {/* Item details */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.category}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    <span className="inline-flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item.location}
                    </span>
                  </p>

                  {/* Customers who bought this */}
                  {item.quantity > 5 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Recently purchased by:
                      </p>
                      <div className="flex items-center -space-x-2">
                        {[
                          ...Array(Math.min(3, Math.floor(item.quantity / 5))),
                        ].map((_, idx) => (
                          <div
                            key={idx}
                            className="relative group z-0 hover:z-10 transition-all"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 dark:bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Customer {idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to cart button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.quantity <= 0}
                    className={`mt-6 w-full ${
                      item.quantity <= 0
                        ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                        : activeTab === "supermarket"
                          ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                          : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    } text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
                  >
                    <FiShoppingCart className="h-5 w-5" />
                    {item.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Section footer */}
        <motion.div variants={fadeIn("up", 0.6)} className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            These products are already available in our Sri Lankan warehouse for
            faster delivery within 2-3 business days. No international shipping
            wait!
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200">
            View All {activeTab === "supermarket" ? "Supermarket" : "Pharmacy"}{" "}
            Products
            <FiArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AvailableInSriLanka;
