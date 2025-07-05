/* eslint-disable @next/next/no-img-element */
"use client";

import { useCartStore } from "@/store/useCartStore";
import { LkrFormat } from "@/utils/format";
import { fadeIn, listItem, staggerContainer } from "@/utils/motion";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";

const ShoppingCartPage = () => {
  const products = useCartStore((state) => state.products);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [isClearing, setIsClearing] = useState(false);

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const priceValue =
        parseFloat(product.calculatedPrice.replace(/[^\d.-]/g, "")) || 0;
      return total + priceValue * (product.quantity || 1);
    }, 0);
  };

  const totalPrice = calculateTotal();
  const itemCount = products.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeProduct(index);
    } else {
      updateQuantity(index, newQuantity);
    }
  };

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Your Shopping Cart
            </h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="show"
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Cart Items */}
          <motion.div
            variants={fadeIn("right", 0.2)}
            className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
          >
            {products.length === 0 ? (
              <motion.div
                variants={fadeIn("up", 0.4)}
                className="h-full flex flex-col items-center justify-center text-center p-12"
              >
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500">
                  <FiShoppingBag className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                  {`Looks like you haven't added any items to your cart yet`}
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                  </h2>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {products.map((product, idx) => (
                      <motion.li
                        key={`${product.name}-${idx}`}
                        custom={idx}
                        variants={listItem}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: isClearing ? 100 : 0,
                          transition: { duration: 0.3 },
                        }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0">
                            {product.image ? (
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                className="w-24 h-24 object-contain rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden"
                              >
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-contain p-2"
                                />
                              </motion.div>
                            ) : (
                              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500">
                                <FiShoppingBag className="h-8 w-8" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                {product.name}
                              </h3>
                              <motion.button
                                onClick={() => removeProduct(idx)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 ml-2 transition-colors"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                            <p className="text-green-600 dark:text-green-400 font-semibold mt-1">
                              {LkrFormat(Number(product.calculatedPrice))}
                            </p>
                            {product.url && (
                              <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 dark:text-blue-400 hover:underline mt-1 truncate block"
                              >
                                View product
                              </a>
                            )}

                            {/* Quantity Controls */}
                            <div className="flex items-center mt-4">
                              <motion.button
                                onClick={() =>
                                  handleQuantityChange(
                                    idx,
                                    (product.quantity || 1) - 1
                                  )
                                }
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer transition-colors"
                              >
                                <FiMinus className="h-4 w-4" />
                              </motion.button>
                              <span className="mx-4 w-8 text-center font-medium text-gray-800 dark:text-gray-200">
                                {product.quantity || 1}
                              </span>
                              <motion.button
                                onClick={() =>
                                  handleQuantityChange(
                                    idx,
                                    (product.quantity || 1) + 1
                                  )
                                }
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer transition-colors"
                              >
                                <FiPlus className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {LkrFormat(
                                parseFloat(
                                  product.calculatedPrice.replace(
                                    /[^\d.-]/g,
                                    ""
                                  )
                                ) * (product.quantity || 1)
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </>
            )}
          </motion.div>

          {/* Order Summary */}
          {products.length > 0 && (
            <motion.div variants={fadeIn("left", 0.4)} className="lg:w-96">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-8 transition-colors duration-200">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Order Summary
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {LkrFormat(Number(totalPrice || 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Total
                      </span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {LkrFormat(Number(totalPrice || 0))}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <Link
                      href="/checkout"
                      className="block w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium shadow-md transition-colors text-center"
                    >
                      Proceed to Checkout
                    </Link>
                    <motion.button
                      onClick={handleClearCart}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      <FiTrash2 className="h-5 w-5" />
                      Clear Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ShoppingCartPage;
