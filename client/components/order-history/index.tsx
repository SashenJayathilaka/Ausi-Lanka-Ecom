/* eslint-disable @next/next/no-img-element */
"use client";

import { DEFAULT_LIMIT } from "@/constants/constants";
import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { AnimatePresence, motion } from "framer-motion";
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
  const [data] = trpc.getItem.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const orders = data?.pages.flatMap((page) => page.items) || [];

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const statusConfig = {
      pending: { color: "bg-amber-100 text-amber-800", icon: <FiClock /> },
      confirmed: {
        color: "bg-blue-100 text-blue-800",
        icon: <FiCheckCircle />,
      },
      shipped: { color: "bg-purple-100 text-purple-800", icon: <FiTruck /> },
      delivered: {
        color: "bg-emerald-100 text-emerald-800",
        icon: <FiPackage />,
      },
      cancelled: { color: "bg-rose-100 text-rose-800", icon: <FiXCircle /> },
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
      </motion.span>
    );
  };

  const TrackingProgress = ({ status }: { status: OrderStatus }) => {
    const steps = [
      { id: "pending", label: "Processing", icon: <FiClock /> },
      { id: "confirmed", label: "Confirmed", icon: <FiCheckCircle /> },
      { id: "shipped", label: "Shipped", icon: <FiTruck /> },
      { id: "delivered", label: "Delivered", icon: <FiPackage /> },
    ] as const;

    const currentStepIndex = steps.findIndex((step) => step.id === status);
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

    return (
      <div className="relative">
        <div className="flex justify-between mb-3 text-xs text-gray-500">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="text-center w-full"
              animate={{
                color:
                  step.id === status
                    ? "hsl(240, 5%, 30%)"
                    : "hsl(240, 5%, 70%)",
                fontWeight: step.id === status ? 600 : 400,
              }}
            >
              {step.label}
            </motion.div>
          ))}
        </div>

        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600"
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
                    ? "bg-white border-indigo-600 shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
                    : "bg-gray-50 border-gray-200"
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  animate={{
                    color:
                      index <= activeIndex
                        ? "hsl(243, 75%, 59%)"
                        : "hsl(240, 5%, 70%)",
                    scale: index <= activeIndex ? 1.1 : 1,
                  }}
                >
                  {step.icon}
                </motion.div>
              </motion.div>
              {index <= activeIndex && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <motion.div
                    className="h-2.5 w-2.5 bg-indigo-600 rounded-full shadow-[0_0_0_2px_white]"
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <motion.h1
          className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your Order History
        </motion.h1>
        <motion.p
          className="text-gray-500 max-w-2xl mx-auto"
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
            className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FiPackage className="mx-auto h-16 w-16 text-gray-300 mb-5" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Your order history will appear here once you make purchases
            </p>
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
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group"
              >
                {/* Order header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <StatusBadge status={order.status} />
                        <span className="font-medium text-gray-900">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>

                      {/* User Information */}
                      <div className="flex items-start gap-3 mt-2">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <FiUser className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.mobile}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        {LkrFormat(Number(order.totalAmount))}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-6 border-b border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <FiMapPin className="h-4 w-4" />
                    Delivery Address
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800">
                      {order.addressLine1},{" "}
                      {order.addressLine2 && `${order.addressLine2}, `}
                      {order.city}, {order.district}
                      <br />
                      {order.postalCode}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
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
                <div className="p-6 border-b border-gray-100 cursor-pointer">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Order Items ({order.items.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items.map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex-shrink-0 w-16 h-16 bg-white rounded-md overflow-hidden border border-gray-200 cursor-pointer">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {LkrFormat(Number(item.calculatedPrice))} ×{" "}
                            {item.quantity}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {item.retailer}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tracking progress */}
                <div className="p-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Order Status
                  </h4>
                  <TrackingProgress status={order.status} />

                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <FiTruck className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.status === "delivered"
                            ? "Delivered"
                            : "Estimated Delivery"}
                        </p>
                        <p className="text-xs text-gray-500">
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
                                    (order.deliveryMethod === "air"
                                      ? 10
                                      : order.deliveryMethod === "sea"
                                      ? 28
                                      : 5)
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

            {/*             {hasNextPage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 text-center"
              >
                <motion.button
                  onClick={() => fetchNextPage()}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-sm"
                >
                  Load More Orders
                </motion.button>
              </motion.div>
            )} */}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderHistoryPageSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-12 text-center">
        <div className="h-12 w-64 mx-auto bg-gray-200 rounded-lg mb-4" />
        <div className="h-5 w-80 mx-auto bg-gray-200 rounded" />
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-8">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Order Header Skeleton */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-24 bg-gray-200 rounded-full" />
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-gray-200 rounded" />
                      <div className="h-3 w-32 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-7 w-24 bg-gray-200 rounded ml-auto" />
                  <div className="h-4 w-32 bg-gray-200 rounded ml-auto" />
                </div>
              </div>
            </div>

            {/* Delivery Address Skeleton */}
            <div className="p-6 border-b border-gray-100">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-48 bg-gray-200 rounded mt-3" />
              </div>
            </div>

            {/* Order Items Skeleton */}
            <div className="p-6 border-b border-gray-100">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                      <div className="h-3 w-1/3 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Progress Skeleton */}
            <div className="p-6">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4" />

              {/* Progress Bar Skeleton */}
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-8">
                <div className="absolute top-0 left-0 h-full bg-gray-200 w-3/4" />
              </div>

              {/* Progress Steps Skeleton */}
              <div className="flex justify-between">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col items-center w-full"
                  >
                    <div className="h-8 w-8 bg-gray-200 rounded-full mb-2" />
                  </div>
                ))}
              </div>

              {/* Delivery Info Skeleton */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="pt-6 text-center">
        <div className="h-12 w-40 mx-auto bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};
