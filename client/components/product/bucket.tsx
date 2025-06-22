"use client";

import { clearBucket, removeProduct } from "@/store/bucketSlice";
import { RootState } from "@/store/store";
import { fadeIn, listItem, staggerContainer } from "@/utils/motion";
import { motion } from "framer-motion";
import { FiPackage, FiShoppingCart, FiTrash2, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const Bucket = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.bucket.products);

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const priceValue = parseFloat(product.price.replace(/[^\d.-]/g, "")) || 0;
      return total + priceValue;
    }, 0);
  };

  const totalPrice = calculateTotal();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl shadow-xl flex flex-col h-full w-full lg:w-96"
    >
      {/* Bucket Header */}
      <motion.div
        className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100"
        variants={fadeIn("down", 0.2)}
      >
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="flex-shrink-0 p-2 rounded-full bg-blue-100 text-blue-600">
              <FiShoppingCart className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 truncate">
              Your Shopping Bucket
            </h2>
          </div>
          <span className="flex-shrink-0 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {products.length} {products.length === 1 ? "item" : "items"}
          </span>
        </div>
      </motion.div>

      {/* Bucket Content */}
      <motion.div
        className="flex-1 overflow-y-auto"
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
      >
        {products.length === 0 ? (
          <motion.div
            className="h-full flex flex-col items-center justify-center text-center p-6"
            variants={fadeIn("up", 0.4)}
          >
            <div className="mb-6 p-4 bg-gray-100 rounded-full text-gray-400">
              <FiPackage className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">
              Your bucket is empty
            </h3>
            <p className="text-gray-500 mt-2 max-w-md">
              Products you add from Chemist Warehouse will appear here
            </p>
          </motion.div>
        ) : (
          <motion.ul className="divide-y divide-gray-200">
            {products.map((product, idx) => (
              <motion.li
                key={idx}
                custom={idx}
                variants={listItem}
                className="p-4 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {product.image ? (
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-contain rounded-lg bg-gray-100"
                        whileHover={{ scale: 1.05 }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
                        <FiPackage className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-green-600 font-semibold mt-1">
                      {product.price}
                    </p>
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline mt-1 truncate block w-full"
                      >
                        View product
                      </a>
                    )}
                  </div>

                  <motion.button
                    onClick={() => dispatch(removeProduct(idx))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors flex-shrink-0"
                  >
                    <FiX className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>

      {/* Fixed Bucket Footer - Always shows when there are items */}
      {products.length > 0 && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-blue-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium shadow-md transition-colors"
            >
              Proceed to Checkout
            </motion.button>
            <motion.button
              onClick={() => dispatch(clearBucket())}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <FiTrash2 className="h-5 w-5" />
              Clear Bucket
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Bucket;
