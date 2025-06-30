"use client";

import {
  FiPackage,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiXCircle,
  FiChevronRight,
  FiBox,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type OrderItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

type TrackingInfo = {
  carrier: string;
  number: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
};

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

type Order = {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  tracking?: TrackingInfo;
};

// Exactly 4 sample orders covering different statuses
const testOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-1001",
    date: "2024-02-15",
    total: 189.97,
    status: "delivered",
    items: [
      {
        id: "101",
        name: "Wireless Earbuds Pro",
        image: "/earbuds.jpg",
        quantity: 1,
        price: 149.99,
      },
      {
        id: "102",
        name: "Charging Case",
        image: "/case.jpg",
        quantity: 1,
        price: 39.98,
      },
    ],
    tracking: {
      carrier: "DHL",
      number: "DH87654321",
      estimatedDelivery: "2024-02-20",
      actualDelivery: "2024-02-18",
    },
  },
  {
    id: "2",
    orderNumber: "ORD-2024-1002",
    date: "2024-03-05",
    total: 89.5,
    status: "shipped",
    items: [
      {
        id: "201",
        name: "Smart Fitness Band",
        image: "/band.jpg",
        quantity: 1,
        price: 89.5,
      },
    ],
    tracking: {
      carrier: "FedEx",
      number: "FX12345678",
      estimatedDelivery: "2024-03-12",
    },
  },
  {
    id: "3",
    orderNumber: "ORD-2024-1003",
    date: "2024-03-10",
    total: 245.25,
    status: "confirmed",
    items: [
      {
        id: "301",
        name: "Bluetooth Speaker",
        image: "/speaker.jpg",
        quantity: 1,
        price: 129.99,
      },
      {
        id: "302",
        name: "Portable Stand",
        image: "/stand.jpg",
        quantity: 1,
        price: 115.26,
      },
    ],
  },
  {
    id: "4",
    orderNumber: "ORD-2024-1004",
    date: "2024-03-12",
    total: 75.99,
    status: "pending",
    items: [
      {
        id: "401",
        name: "Phone Mount",
        image: "/mount.jpg",
        quantity: 2,
        price: 37.99,
      },
    ],
  },
];

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <FiClock className="h-4 w-4" />,
      label: "Processing",
    },
    confirmed: {
      color: "bg-blue-100 text-blue-800",
      icon: <FiCheckCircle className="h-4 w-4" />,
      label: "Confirmed",
    },
    shipped: {
      color: "bg-purple-100 text-purple-800",
      icon: <FiTruck className="h-4 w-4" />,
      label: "Shipped",
    },
    delivered: {
      color: "bg-green-100 text-green-800",
      icon: <FiPackage className="h-4 w-4" />,
      label: "Delivered",
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: <FiXCircle className="h-4 w-4" />,
      label: "Cancelled",
    },
  };

  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].color}`}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {statusConfig[status].icon}
      {statusConfig[status].label}
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
      <div className="flex justify-between mb-2 text-xs text-gray-500">
        {steps.map((step) => (
          <div key={step.id} className="text-center w-full">
            {step.label}
          </div>
        ))}
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          initial={{ width: "0%" }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative flex flex-col items-center w-full"
          >
            <motion.div
              className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                index <= activeIndex
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                  : "bg-white text-gray-400 border-gray-300"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {step.icon}
            </motion.div>
            {index <= activeIndex && (
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <div className="h-2 w-2 bg-indigo-600 rounded-full" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderHistoryPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.h1
        className="text-3xl font-bold text-gray-900 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Your Recent Orders
      </motion.h1>

      <AnimatePresence mode="wait">
        {testOrders.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <FiBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mt-2">
              Your order history will appear here once you make purchases
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="orders-list"
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {testOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
                whileHover={{ scale: 1.005 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow"
              >
                {/* Order header */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        #{order.orderNumber}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Ordered on{" "}
                      {new Date(order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-end gap-1 mt-1">
                      View details <FiChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Order items */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {order.items.map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shadow-xs">
                          {item.quantity}
                        </div>
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <div className="w-12 h-12 bg-gray-200 rounded-md" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tracking progress */}
                <div className="p-5">
                  <TrackingProgress status={order.status} />

                  {order.tracking && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-gray-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-sm text-gray-500 mb-2">
                        Tracking information:
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 rounded-lg p-2">
                          <FiTruck className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.tracking.carrier} · {order.tracking.number}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.status === "delivered" ? (
                              <>
                                Delivered on{" "}
                                {new Date(
                                  order.tracking.actualDelivery!
                                ).toLocaleDateString()}
                              </>
                            ) : (
                              <>
                                Est. delivery:{" "}
                                {new Date(
                                  order.tracking.estimatedDelivery!
                                ).toLocaleDateString()}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderHistoryPage;
