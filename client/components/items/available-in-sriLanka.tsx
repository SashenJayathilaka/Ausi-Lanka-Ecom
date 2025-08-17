/* eslint-disable @next/next/no-img-element */
"use client";

import { useCartStore } from "@/store/useCartStore";
import { LkrFormat } from "@/utils/format";
import { fadeIn } from "@/utils/motion";
import { motion } from "framer-motion";
import { FiArrowRight, FiPackage, FiShoppingCart } from "react-icons/fi";

type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  url: string;
  retailer: string;
  calculatedPrice: string;
  stock: number; // Added stock count
  location: "Australia" | "Sri Lanka"; // Added location
};

const availableInSriLanka: Product[] = [
  {
    id: "5",
    title: "Ceylon Tea (500g)",
    price: " 8.99",
    image: "https://cdn.productimages.coles.com.au/productimages/8/8168240.jpg",
    url: "/products/ceylon-tea",
    retailer: "Ausi.Lk",
    calculatedPrice: "8.99",
    stock: 42,
    location: "Sri Lanka",
  },
  {
    id: "6",
    title: "Maldive Fish (200g)",
    price: "12.5",
    image: "https://cdn.productimages.coles.com.au/productimages/8/8168240.jpg",
    url: "/products/maldive-fish",
    retailer: "Ausi.Lk",
    calculatedPrice: "12.5",
    stock: 18,
    location: "Sri Lanka",
  },
  {
    id: "7",
    title: "Coconut Sambol Mix",
    price: "6.75",
    image: "https://cdn.productimages.coles.com.au/productimages/8/8168240.jpg",
    url: "/products/coconut-sambol",
    retailer: "Ausi.Lk",
    calculatedPrice: "6.75",
    stock: 35,
    location: "Sri Lanka",
  },
  {
    id: "8",
    title: "Jaggery (1kg)",
    price: "9.25",
    image: "https://cdn.productimages.coles.com.au/productimages/8/8168240.jpg",
    url: "/products/jaggery",
    retailer: "Ausi.Lk",
    calculatedPrice: "9.25",
    stock: 27,
    location: "Sri Lanka",
  },
];

const AvailableInSriLanka = () => {
  const addProduct = useCartStore((state) => state.addProduct);

  const handleAddToCart = (product: Product) => {
    addProduct({
      name: product.title,
      price: product.price,
      image: product.image,
      url: product.url,
      retailer: product.retailer,
      calculatedPrice: product.calculatedPrice,
    });
  };

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
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
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

        {/* Products grid */}
        <motion.div
          variants={fadeIn("up", 0.4)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {availableInSriLanka.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/20 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              {/* Item image */}
              <div className="relative h-48 w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Stock and price tag */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="bg-green-100 dark:bg-green-900/80 px-3 py-1 rounded-full shadow-sm text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-1">
                    <FiPackage className="h-3 w-3" />
                    {item.stock} in stock
                  </div>
                  <div className="bg-white dark:bg-gray-900 px-3 py-1 rounded-full shadow-sm text-sm font-medium text-amber-600 dark:text-amber-400">
                    {LkrFormat(Number(item.calculatedPrice))}
                  </div>
                </div>
              </div>

              {/* Item details */}
              <div className="p-5">
                <h3 className="text-lg font-semibold dark:text-white">
                  {item.title}
                </h3>
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
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Recently purchased by:
                  </p>
                  <div className="flex items-center -space-x-2">
                    {[...Array(Math.min(3, Math.floor(item.stock / 5)))].map(
                      (_, idx) => (
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
                      )
                    )}
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stock <= 0}
                  className={`mt-6 w-full ${
                    item.stock <= 0
                      ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                  } text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
                >
                  <FiShoppingCart className="h-5 w-5" />
                  {item.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Section footer */}
        <motion.div variants={fadeIn("up", 0.5)} className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            These products are already available in our Sri Lankan warehouse for
            faster delivery within 2-3 business days. No international shipping
            wait!
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200">
            View All Local Products
            <FiArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AvailableInSriLanka;
