"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiAnchor,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import { z } from "zod";
import { checkoutFormSchema } from ".";

type Props = {
  formValues: z.infer<typeof checkoutFormSchema>;
};

function OrderSuccess({ formValues }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `ORD-${year}${month}${day}-${random}`;
  };

  const orderNumber = generateOrderNumber();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        {/* Confetti effect */}
        <AnimatePresence>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * 40 - 20, opacity: 0 }}
              animate={{
                y: [0, Math.random() * 100 + 50],
                x: Math.random() * 80 - 40,
                opacity: [1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 5,
              }}
              className="absolute top-0 left-1/2 text-2xl"
              style={{
                color: ["#4ade80", "#60a5fa", "#fbbf24", "#f472b6"][
                  Math.floor(Math.random() * 4)
                ],
              }}
            >
              {["🎉", "✨", "✅", "🛒"][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Main content */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.4 }}
            >
              <div className="relative">
                <FiCheckCircle className="h-16 w-16 text-green-500" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-500/20 dark:bg-green-500/10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 2.5 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>

          <motion.h2
            className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Order Confirmed! 🎊
          </motion.h2>

          <motion.p
            className="text-gray-600 dark:text-gray-300 mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {`Thank you for your purchase, ${formValues.name}! We'll contact you shortly on `}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {formValues.mobile}
            </span>
            .
          </motion.p>

          <motion.div
            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-800 dark:text-blue-300 flex items-center gap-2">
                  <FiTruck className="h-4 w-4" /> Delivery Address:
                </p>
                <p className="text-gray-700 dark:text-blue-200 pl-6 mt-1">
                  {formValues.addressLine1}
                  <br />
                  {formValues.addressLine2 && (
                    <>
                      {formValues.addressLine2}
                      <br />
                    </>
                  )}
                  {formValues.city}, {formValues.district}
                  <br />
                  {formValues.postalCode}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800 dark:text-blue-300 flex items-center gap-2">
                  <FiClock className="h-4 w-4" /> Delivery Method:
                </p>
                <p className="text-gray-700 dark:text-blue-200 pl-6 mt-1">
                  {formValues.deliveryMethod === "air" ? (
                    <span className="flex items-center gap-1">
                      <FiZap className="h-4 w-4 text-yellow-500" />
                      Air Cargo (1 week delivery)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <FiAnchor className="h-4 w-4 text-blue-500" />
                      Sea Cargo (1 month delivery)
                    </span>
                  )}
                </p>
              </div>

              {formValues.comments && (
                <div>
                  <p className="font-semibold text-gray-800 dark:text-blue-300 flex items-center gap-2">
                    <FiMessageSquare className="h-4 w-4" /> Your Comments:
                  </p>
                  <p className="text-gray-700 dark:text-blue-200 pl-6 mt-1">
                    {formValues.comments}
                  </p>
                </div>
              )}

              {formValues.missingItems && (
                <div>
                  <p className="font-semibold text-gray-800 dark:text-yellow-300 flex items-center gap-2">
                    <FiAlertTriangle className="h-4 w-4 text-yellow-500" />{" "}
                    Missing Items:
                  </p>
                  <p className="text-gray-700 dark:text-yellow-200 pl-6 mt-1">
                    {formValues.missingItems}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            <Link
              href="/history"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Order History <FiShoppingBag className="h-5 w-5" />
            </Link>
            <button
              onClick={() => router.push("/")}
              className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              Continue Shopping
            </button>
          </motion.div>
        </motion.div>

        {/* Order number badge */}
        <motion.div
          className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          Order #{orderNumber}
        </motion.div>
      </motion.div>

      {/* Floating shopping cart icon */}
      <motion.div
        className="fixed bottom-8 right-8 bg-white dark:bg-gray-700 p-4 rounded-full shadow-xl cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/orders")}
      >
        <FiPackage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </motion.div>

      {/* Order summary email notice */}
      <motion.div
        className="mt-6 text-center text-gray-600 dark:text-gray-400 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>A confirmation email has been sent to your email address.</p>
        <p className="text-sm mt-1">
          {`  (Check your spam folder if you don't see it)`}
        </p>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;
