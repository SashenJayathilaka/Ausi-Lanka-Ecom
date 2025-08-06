/* eslint-disable @next/next/no-img-element */
"use client";

import { DEFAULT_LIMIT } from "@/constants/constants";
import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { useRouter } from "next/navigation";
import React, { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiPhone,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";
import { OrderWithItemsAndUser } from "../type";

const OrderAdminDetails = () => {
  return (
    <Suspense fallback={<OrderAdminSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <OrderAdminPageSectionsSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export default OrderAdminDetails;

const OrderCard = ({
  order,
  onStatusUpdate,
}: {
  order: OrderWithItemsAndUser;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await onStatusUpdate(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 mb-6 bg-white">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4">
        <div
          onClick={() =>
            router.push(`${process.env.NEXT_PUBLIC_APP_URL}/admin/${order.id}`)
          }
          className="cursor-pointer hover:underline"
        >
          <h3 className="font-medium text-lg">Order #{order.id}</h3>
          <p className="text-sm text-gray-500 flex items-center">
            <FiCalendar className="mr-1" />
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center">
          {isUpdating ? (
            <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          ) : (
            <select
              value={order.status}
              onChange={handleStatusChange}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                order.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
              } border-none focus:ring-2 focus:ring-blue-500`}
            >
              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center underline">
            <FiUser className="mr-2" /> Customer
          </h4>
          <p className="font-semibold">{order.name}</p>
          <p className="text-sm text-gray-500 flex items-center mt-1 font-semibold">
            <FiPhone className="mr-1" /> {order.mobile}
          </p>
          {order.user?.emailId && (
            <p className="text-sm text-gray-500 font-semibold">
              {order.user.emailId}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center underline">
            <FiDollarSign className="mr-2" /> Order Summary
          </h4>
          <p className="font-semibold">
            Total: {LkrFormat(Number(order.totalAmount))}
          </p>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-gray-500 flex items-center mt-1 font-semibold">
            <FiTruck className="mr-1" /> {order.deliveryMethod} delivery
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center underline">
            <FiMapPin className="mr-2" /> Shipping
          </h4>
          <p className="font-semibold">{order.addressLine1}</p>
          {order.addressLine2 && (
            <p className="font-semibold">{order.addressLine2}</p>
          )}
          <p className="font-semibold">
            {order.city}, {order.district}
          </p>
          <p className="font-semibold">{order.postalCode}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 underline">Order Items</h4>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-4 border-b hover:bg-gray-100 transition-colors"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded mr-4"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(item.url || "#", "_blank");
                }}
                style={{ cursor: item.url ? "pointer" : "default" }}
              />
              <div className="flex-1">
                <h5
                  className="font-medium hover:underline"
                  style={{ cursor: item.url ? "pointer" : "default" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.url) window.open(item.url, "_blank");
                  }}
                >
                  {item.name}
                </h5>
                <p className="text-sm text-gray-500 font-semibold">
                  {LkrFormat(Number(item.calculatedPrice))} × {item.quantity}
                </p>
                <div className="mt-1 flex items-center">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                    {item.retailer}
                  </span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Product
                    </a>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {LkrFormat(parseFloat(item.calculatedPrice) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments (if any) */}
      {order.comments && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Customer Comments</h4>
          <p className="bg-gray-50 p-4 rounded-lg">{order.comments}</p>
        </div>
      )}

      {/* Order Total */}
      <div className="flex justify-end">
        <div className="bg-gray-50 p-4 rounded-lg w-full md:w-1/3">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold">
              {LkrFormat(Number(order.totalAmount))}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Shipping</span>
            <span>0.00</span>
          </div>
          <div className="border-t my-2"></div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="font-bold">
              {LkrFormat(Number(order.totalAmount))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderAdminPageSectionsSuspense: React.FC = () => {
  const utils = trpc.useUtils();
  const [data] = trpc.getAdminItems.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const updateStatusMutation = trpc.getAdminItems.updateOrderStatus.useMutation(
    {
      onSuccess: (updatedOrder) => {
        utils.getAdminItems.getMany.invalidate();
        toast.success(`Order status updated to ${updatedOrder.status}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({
      orderId,
      status: newStatus as
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Orders</h2>
        </div>
      </div>

      <div>
        {data.pages.map((page, i) => (
          <div key={i}>
            {page.items.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderAdminSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        </div>

        {/* Order Cards Skeleton - Shows 3 skeleton cards */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 mb-6 bg-white">
            {/* Order Header Skeleton */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>

            {/* Customer and Order Summary Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Order Items Skeleton */}
            <div className="mb-6">
              <div className="h-5 w-24 bg-gray-200 rounded mb-3"></div>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center p-4 border-b">
                    <div className="w-16 h-16 bg-gray-200 rounded mr-4"></div>
                    <div className="flex-1">
                      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-5 w-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total Skeleton */}
            <div className="flex justify-end">
              <div className="bg-gray-50 p-4 rounded-lg w-full md:w-1/3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between mb-2">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
                <div className="border-t my-2"></div>
                <div className="flex justify-between">
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  <div className="h-5 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
