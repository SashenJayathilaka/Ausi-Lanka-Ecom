"use client";

import { DEFAULT_LIMIT } from "@/constants/constants";
import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import OrderHistoryPageSkeleton from "./order-history-page-skeleton";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export const OrderHistoryPage: React.FC = () => {
  return (
    <Suspense fallback={<OrderHistoryPageSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <OrderHistoryPageSectionsSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const OrderHistoryPageSectionsSuspense: React.FC = () => {
  const { theme } = useTheme();
  const [data] = trpc.getItem.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const orders = data?.pages.flatMap((page) => page.items) || [];

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const statusConfig = {
      pending: {
        color:
          "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200",
        icon: <FiClock className="dark:text-amber-400" />,
        emoji: "🎃",
      },
      confirmed: {
        color:
          "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
        icon: <FiCheckCircle className="dark:text-orange-400" />,
        emoji: "👻",
      },
      shipped: {
        color:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200",
        icon: <FiTruck className="dark:text-purple-400" />,
        emoji: "🦇",
      },
      delivered: {
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
        icon: <FiPackage className="dark:text-green-400" />,
        emoji: "🍬",
      },
      cancelled: {
        color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
        icon: <FiXCircle className="dark:text-red-400" />,
        emoji: "💀",
      },
    };

    return (
      <motion.span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        {statusConfig[status].icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
        <span className="ml-1 text-sm">{statusConfig[status].emoji}</span>
      </motion.span>
    );
  };

  const TrackingProgress = ({ status }: { status: OrderStatus }) => {
    const steps = [
      { id: "pending", label: "Processing", icon: <FiClock />, emoji: "🎃" },
      {
        id: "confirmed",
        label: "Confirmed",
        icon: <FiCheckCircle />,
        emoji: "👻",
      },
      { id: "shipped", label: "Shipped", icon: <FiTruck />, emoji: "🦇" },
      { id: "delivered", label: "Delivered", icon: <FiPackage />, emoji: "🍬" },
    ] as const;

    const currentStepIndex = steps.findIndex((step) => step.id === status);
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

    return (
      <div className="relative">
        <div className="flex justify-between mb-3 text-xs text-gray-500 dark:text-gray-400">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="text-center w-full"
              animate={{
                color:
                  step.id === status
                    ? theme === "dark"
                      ? "hsl(0, 0%, 90%)"
                      : "hsl(240, 5%, 30%)"
                    : theme === "dark"
                      ? "hsl(0, 0%, 60%)"
                      : "hsl(240, 5%, 70%)",
                fontWeight: step.id === status ? 600 : 400,
              }}
            >
              {step.label}
            </motion.div>
          ))}
        </div>

        <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-purple-600 dark:from-orange-600 dark:to-purple-700"
            initial={{ width: "0%" }}
            animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative flex flex-col items-center w-full"
            >
              <motion.div
                className={`h-9 w-9 rounded-full flex items-center justify-center border-2 ${
                  index <= activeIndex
                    ? "bg-white dark:bg-gray-800 border-orange-600 dark:border-orange-500 shadow-[0_0_0_3px_rgba(255,165,0,0.2)] dark:shadow-[0_0_0_3px_rgba(255,165,0,0.3)]"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  animate={{
                    color:
                      index <= activeIndex
                        ? theme === "dark"
                          ? "hsl(25, 95%, 60%)"
                          : "hsl(25, 95%, 50%)"
                        : theme === "dark"
                          ? "hsl(0, 0%, 60%)"
                          : "hsl(240, 5%, 70%)",
                    scale: index <= activeIndex ? 1.1 : 1,
                  }}
                >
                  {step.icon}
                </motion.div>
              </motion.div>
              <div className="mt-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {step.emoji}
              </div>
              {index <= activeIndex && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <motion.div
                    className="h-2.5 w-2.5 bg-orange-600 dark:bg-orange-500 rounded-full shadow-[0_0_0_2px_white] dark:shadow-[0_0_0_2px_hsl(240,5%,15%)]"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-t from-orange-50/50 to-purple-100/30 dark:from-gray-900 dark:to-purple-900/20 transition-colors duration-500 relative overflow-hidden">
      {/* Halloween decorations */}
      <div className="absolute top-10 left-5 text-4xl animate-bounce-slow opacity-80 dark:opacity-100">
        🎃
      </div>
      <div className="absolute top-20 right-8 text-3xl animate-pulse-slow opacity-80 dark:opacity-100">
        👻
      </div>
      <div className="absolute bottom-20 left-10 text-2xl animate-spin-slow opacity-80 dark:opacity-100">
        🕷️
      </div>
      <div className="absolute bottom-10 right-5 text-3xl animate-bounce-medium opacity-80 dark:opacity-100">
        🦇
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <motion.h1
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 dark:from-gray-200 to-orange-600 dark:to-orange-400 bg-clip-text text-transparent mt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Order History
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Track your purchases and delivery status
          </motion.p>
        </motion.div>
        <AnimatePresence mode="wait">
          {orders.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-orange-200 dark:border-purple-700"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FiPackage className="mx-auto h-16 w-16 text-orange-300 dark:text-purple-600 mb-5" />
              </motion.div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Your order history will appear here once you make purchases
              </p>
              <div className="text-4xl">🎃</div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    y: -3,
                    boxShadow:
                      theme === "dark"
                        ? "0 10px 25px -5px rgba(255,165,0,0.2)"
                        : "0 10px 25px -5px rgba(255,165,0,0.1)",
                  }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-orange-200 dark:border-purple-700 overflow-hidden relative group transition-colors duration-300"
                >
                  {/* Halloween corner accent */}
                  <div className="absolute top-4 right-4 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {order.status === "delivered"
                      ? "🍬"
                      : order.status === "shipped"
                        ? "🦇"
                        : order.status === "confirmed"
                          ? "👻"
                          : "🎃"}
                  </div>

                  {/* Order header */}
                  <div className="p-6 border-b border-orange-200 dark:border-purple-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <StatusBadge status={order.status} />
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>

                        {/* User Information */}
                        <div className="flex items-start gap-3 mt-2">
                          <div className="bg-orange-100 dark:bg-purple-700 p-2 rounded-lg">
                            <FiUser className="h-4 w-4 text-orange-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                              {order.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {order.mobile}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900 dark:text-gray-200">
                          {LkrFormat(Number(order.totalAmount))}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="p-6 border-b border-orange-200 dark:border-purple-700">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <FiMapPin className="h-4 w-4" />
                      Delivery Address
                    </h4>
                    <div className="bg-orange-50 dark:bg-purple-700/30 rounded-lg p-4">
                      <p className="text-gray-800 dark:text-gray-200">
                        {order.addressLine1},{" "}
                        {order.addressLine2 && `${order.addressLine2}, `}
                        {order.city}, {order.district}
                        <br />
                        {order.postalCode}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Delivery Method:{" "}
                        {order.deliveryMethod === "air"
                          ? "Air Cargo (7-10 days)"
                          : order.deliveryMethod === "sea"
                            ? "Sea Cargo (3-4 weeks)"
                            : "Express (3-5 days)"}
                      </p>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="p-6 border-b border-orange-200 dark:border-purple-700 cursor-pointer">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                      Order Items ({order.items.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.items.map((item) => (
                        <motion.div
                          key={item.id}
                          className="flex gap-4 p-3 bg-orange-50 dark:bg-purple-700/30 rounded-lg border border-orange-200 dark:border-purple-600 transition-colors duration-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-800 rounded-md overflow-hidden border border-orange-200 dark:border-purple-600 cursor-pointer">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {LkrFormat(Number(item.calculatedPrice))} ×{" "}
                              {item.quantity}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                              {item.retailer}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking progress */}
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                      Order Status
                    </h4>
                    <TrackingProgress status={order.status} />

                    <div className="mt-6 pt-5 border-t border-orange-200 dark:border-purple-700">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 dark:bg-purple-700 rounded-lg p-2">
                          <FiTruck className="h-5 w-5 text-orange-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {order.status === "delivered"
                              ? "Delivered"
                              : "Estimated Delivery"}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {order.status === "delivered"
                              ? new Date(order.updatedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : new Date(
                                  new Date(order.createdAt).setDate(
                                    new Date(order.createdAt).getDate() +
                                      (order.deliveryMethod === "air" ? 10 : 65)
                                  )
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes bounce-medium {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
        .animate-bounce-medium {
          animation: bounce-medium 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
