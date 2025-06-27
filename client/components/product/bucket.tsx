/* eslint-disable @next/next/no-img-element */
"use client";

import { useCartStore } from "@/store/useCartStore";
import { fadeIn, listItem, staggerContainer } from "@/utils/motion";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FiMinus,
  FiPlus,
  FiPackage,
  FiShoppingCart,
  FiTrash2,
  FiX,
} from "react-icons/fi";

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

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeProduct(index);
    } else {
      updateQuantity(index, newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-2xl shadow-xl flex flex-col h-full w-full lg:w-[430px] border-2 border-blue-100 overflow-hidden"
    >
      {/* Enhanced Bucket Header */}
      <motion.div
        className="p-6 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50"
        variants={fadeIn("down", 0.2)}
      >
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="flex-shrink-0 p-2 rounded-full bg-blue-100 text-blue-600 shadow-sm">
              <FiShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 truncate">
                Shopping Bucket
              </h2>
              <p className="text-sm text-blue-600">Review your items</p>
            </div>
          </div>
          <span className="flex-shrink-0 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
            {products.reduce((sum, item) => sum + (item.quantity || 1), 0)}{" "}
            {products.reduce((sum, item) => sum + (item.quantity || 1), 0) === 1
              ? "item"
              : "items"}
          </span>
        </div>
      </motion.div>

      {/* Bucket Content */}
      <motion.div
        className="flex-1 overflow-y-auto bg-white"
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
      >
        {products.length === 0 ? (
          <motion.div
            className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50"
            variants={fadeIn("up", 0.4)}
          >
            <div className="mb-6 p-4 bg-white rounded-full text-blue-300 shadow-inner border-2 border-dashed border-blue-200">
              <FiPackage className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Your bucket is empty
            </h3>
            <p className="text-gray-500 max-w-md">
              Start adding products to see them here
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-2 bg-white border-2 border-blue-200 rounded-lg text-blue-600 font-medium shadow-sm hover:bg-blue-50 transition-all"
              onClick={() => router.push("/")}
            >
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <motion.ul className="divide-y divide-gray-200">
            {products.map((product, idx) => (
              <motion.li
                key={`${product.name}-${idx}`}
                custom={idx}
                variants={listItem}
                className="p-4 hover:bg-blue-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 relative">
                    {product.image ? (
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-contain rounded-lg bg-white border border-gray-200 p-1"
                        whileHover={{ scale: 1.05 }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 border border-gray-200">
                        <FiPackage className="h-8 w-8" />
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
                    <h3 className="text-base font-medium text-gray-900 line-clamp-2">
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

                    {/* Enhanced Quantity Controls */}
                    <div className="flex items-center mt-3 space-x-2">
                      <motion.button
                        onClick={() =>
                          handleQuantityChange(idx, (product.quantity || 1) - 1)
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm"
                      >
                        <FiMinus className="h-4 w-4" />
                      </motion.button>
                      <span className="mx-1 w-8 text-center font-bold text-gray-800">
                        {product.quantity || 1}
                      </span>
                      <motion.button
                        onClick={() =>
                          handleQuantityChange(idx, (product.quantity || 1) + 1)
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm"
                      >
                        <FiPlus className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => removeProduct(idx)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors flex-shrink-0 hover:bg-red-50 rounded-full"
                  >
                    <FiX className="h-6 w-6" />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>

      {/* Enhanced Footer */}
      {products.length > 0 && (
        <div className="border-t border-blue-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Subtotal</span>
              <span className="font-bold text-gray-800">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-blue-200">
              <span className="text-gray-700 font-medium">Shipping</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-bold shadow-lg transition-all"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </motion.button>
            <motion.button
              onClick={clearCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 py-2.5 px-4 rounded-lg font-medium transition-colors bg-white hover:bg-red-50 border border-gray-200"
            >
              <FiTrash2 className="h-5 w-5" />
              <span>Clear Bucket</span>
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Bucket;
