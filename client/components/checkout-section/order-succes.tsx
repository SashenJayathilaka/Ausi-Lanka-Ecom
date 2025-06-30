"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
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
                  className="absolute inset-0 rounded-full bg-green-500/20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 2.5 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>

          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Order Confirmed! 🎊
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {`Thank you for your purchase, ${formValues.name}! We'll contact you shortly on `}
            <span className="font-medium text-blue-600">
              {formValues.mobile}
            </span>
            .
          </motion.p>

          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100 shadow-inner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-blue-800 flex items-center gap-2">
                  <FiTruck className="h-4 w-4" /> Delivery Address:
                </p>
                <p className="text-blue-700 pl-6">
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
                <p className="font-semibold text-blue-800 flex items-center gap-2">
                  <FiClock className="h-4 w-4" /> Delivery Method:
                </p>
                <p className="text-blue-700 pl-6">
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
                  <p className="font-semibold text-blue-800 flex items-center gap-2">
                    <FiMessageSquare className="h-4 w-4" /> Your Comments:
                  </p>
                  <p className="text-blue-700 pl-6">{formValues.comments}</p>
                </div>
              )}

              {formValues.missingItems && (
                <div>
                  <p className="font-semibold text-blue-800 flex items-center gap-2">
                    <FiAlertTriangle className="h-4 w-4 text-yellow-500" />{" "}
                    Missing Items:
                  </p>
                  <p className="text-blue-700 pl-6">
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
          >
            <Link
              href="/history"
              className="inline-flex w-full items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl gap-2"
            >
              Order History <FiShoppingBag className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Order number badge */}
        <motion.div
          className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          Order #{Math.floor(Math.random() * 1000000)}
        </motion.div>
      </motion.div>

      {/* Floating shopping cart icon */}
      <motion.div
        className="fixed bottom-8 right-8 bg-white p-4 rounded-full shadow-xl cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/orders")}
      >
        <FiPackage className="h-6 w-6 text-blue-600" />
      </motion.div>
    </div>
  );
}

export default OrderSuccess;
