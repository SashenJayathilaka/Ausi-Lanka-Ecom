/* eslint-disable @next/next/no-img-element */
"use client";

import { useCartStore } from "@/store/useCartStore";
import { fadeIn, listItem, staggerContainer } from "@/utils/motion";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsBoxSeam, BsArrowLeft } from "react-icons/bs";
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiTrash2,
} from "react-icons/fi";
import { RiShoppingBag3Line } from "react-icons/ri";

const Bucket = () => {
  const router = useRouter();
  const products = useCartStore((state) => state.products);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const priceValue = parseFloat(product.price.replace(/[^\d.-]/g, "")) || 0;
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

  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-2xl shadow-xl flex flex-col h-full w-full border border-gray-100 overflow-hidden"
    >
      {/* Cart Header */}
      <motion.div
        className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600"
        variants={fadeIn("down", 0.2)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white">
              <FiShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Your Cart</h2>
              <p className="text-blue-100 text-sm">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          {products.length > 0 && (
            <motion.button
              onClick={() => {
                setIsAnimatingOut(true);
                setTimeout(() => {
                  clearCart();
                  setIsAnimatingOut(false);
                }, 300);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white/80 hover:text-white text-sm flex items-center gap-1"
            >
              <FiTrash2 className="h-4 w-4" />
              <span>Clear</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Cart Content */}
      <motion.div
        className="flex-1 overflow-y-auto bg-gray-50"
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
      >
        {products.length === 0 ? (
          <motion.div
            className="h-full flex flex-col items-center justify-center text-center p-8"
            variants={fadeIn("up", 0.4)}
          >
            <div className="mb-6 p-5 bg-white rounded-2xl text-blue-400 shadow-lg border border-gray-200">
              <RiShoppingBag3Line className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              {` Looks like you haven't added anything to your cart yet`}
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center gap-2"
              onClick={() => router.push("/products")}
            >
              Browse Products
              <FiArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.ul className="divide-y divide-gray-200">
            <AnimatePresence>
              {products.map((product, idx) => (
                <motion.li
                  key={`${product.name}-${idx}`}
                  custom={idx}
                  variants={listItem}
                  className="p-5 hover:bg-white transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    x: isAnimatingOut ? 100 : 0,
                    transition: { duration: 0.3 },
                  }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                      {product.image ? (
                        <motion.div
                          className="w-20 h-20 rounded-xl bg-white border border-gray-200 overflow-hidden"
                          whileHover={{ scale: 1.03 }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </motion.div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 border border-gray-200">
                          <BsBoxSeam className="h-8 w-8" />
                        </div>
                      )}
                      {/* Retailer badge */}
                      {product.retailer && (
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200">
                          <img
                            src={
                              product.retailer === "Chemist Warehouse"
                                ? "/assets/partner_chemistwarehouse.webp"
                                : product.retailer === "Coles"
                                ? "/assets/coles.png"
                                : product.retailer === "Woolworths"
                                ? "/assets/woolworths.png"
                                : product.retailer === "JB Hi-Fi"
                                ? "/assets/jbhifi.png"
                                : "/assets/officeworks.png"
                            }
                            alt={product.retailer}
                            className="h-5 w-5 object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-green-600 font-bold mt-1 text-lg">
                        {product.price}
                        {product.quantity! > 1 && (
                          <span className="text-gray-500 ml-1 text-sm">
                            × {product.quantity}
                          </span>
                        )}
                      </p>
                      {product.url && (
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline mt-1 truncate block w-full"
                        >
                          View original product
                        </a>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <motion.button
                            onClick={() =>
                              handleQuantityChange(
                                idx,
                                (product.quantity || 1) - 1
                              )
                            }
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700"
                          >
                            <FiMinus className="h-4 w-4" />
                          </motion.button>
                          <span className="px-3 font-medium text-gray-800">
                            {product.quantity || 1}
                          </span>
                          <motion.button
                            onClick={() =>
                              handleQuantityChange(
                                idx,
                                (product.quantity || 1) + 1
                              )
                            }
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700"
                          >
                            <FiPlus className="h-4 w-4" />
                          </motion.button>
                        </div>

                        <motion.button
                          onClick={() => removeProduct(idx)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-red-500 p-1.5 transition-colors hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </motion.div>

      {/* Cart Footer */}
      {products.length > 0 && (
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-blue-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
              <FiArrowRight className="h-5 w-5" />
            </motion.button>

            <motion.button
              onClick={() => router.push("/products")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <BsArrowLeft className="h-4 w-4" />
              Continue Shopping
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Bucket;
