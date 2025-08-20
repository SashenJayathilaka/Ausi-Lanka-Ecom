/* eslint-disable @next/next/no-img-element */
"use client";

import { districts } from "@/lib/districts";
import { useCartStore } from "@/store/useCartStore";
import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiGlobe,
  FiHome,
  FiInfo,
  FiMapPin,
  FiMessageSquare,
  FiMinus,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";
import { z } from "zod";
import OrderSuccess from "./order-succes";

// Zod schema for form validation
export const checkoutFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid Sri Lankan mobile number"),
  deliveryMethod: z.enum(["sea", "air", "express"]),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  postalCode: z.string().regex(/^[0-9]{5}$/, "Invalid postal code"),
  comments: z.string().optional(),
  missingItems: z.string().optional(),
});

const CheckoutPage = () => {
  const clerk = useClerk();
  const { user } = useClerk();
  const { products, removeProduct, updateQuantity, clearCart } = useCartStore();
  const [orderSuccess, setOrderSuccess] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress;

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      mobile: "",
      deliveryMethod: "sea",
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      postalCode: "",
      comments: "",
      missingItems: "",
    },
  });

  const createOrder = trpc.checkout.create.useMutation({
    onSuccess: async (data) => {
      clearCart();
      setOrderSuccess(true);
      toast.success(data.message);

      try {
        // Send customer confirmation email
        await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailType: "customer-confirmation",
            recipient: email,
            orderData: {
              orderId: data.orderId,
              name: data.orderData.name,
              createdAt: new Date().toISOString(),
              totalAmount: data.orderData.totalAmount,
              addressLine1: data.orderData.addressLine1,
              addressLine2: data.orderData.addressLine2 || "",
              city: data.orderData.city,
              postalCode: data.orderData.postalCode,
              mobile: data.orderData.mobile,
            },
          }),
        });

        // Send internal notification email
        await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailType: "internal-notification",
            recipient: "ausilk27@gmail.com", //TODO: Your internal email
            orderData: {
              orderId: data.orderId,
              mobile: data.orderData.mobile,
              createdAt: new Date().toISOString(),
            },
          }),
        });
      } catch (error) {
        console.error("Failed to send emails:", error);
        // Optionally show a toast notification
        toast.error("Order placed but email notifications failed");
      }
    },
    onError: (error) => {
      toast.error("Failed to place order");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  // Calculate base price
  const basePrice = products.reduce((total, product) => {
    const priceValue = parseFloat(
      product.calculatedPrice.replace(/[^0-9.]/g, "")
    );
    const quantity = product.quantity || 1;
    return total + (isNaN(priceValue) ? 0 : priceValue * quantity);
  }, 0);

  // Calculate total price with delivery
  const deliveryMethod = form.watch("deliveryMethod");
  const deliveryFee = deliveryMethod === "air" ? 8500 : 0;
  const totalPrice = basePrice + deliveryFee;

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(index, newQuantity);
    }
  };

  const handleRemoveItem = (index: number) => {
    removeProduct(index);
  };

  const onSubmit = (data: z.infer<typeof checkoutFormSchema>) => {
    if (products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    createOrder.mutate({
      ...data,
      totalAmount: totalPrice,
      items: products.map((product) => ({
        name: product.name,
        price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
        image: product.image || "",
        url: product.url,
        retailer: product.retailer || "",
        calculatedPrice: parseFloat(
          product.calculatedPrice.replace(/[^0-9.]/g, "")
        ),
        quantity: product.quantity || 1,
      })),
      missingItems: data.missingItems ? [data.missingItems] : undefined,
    });
  };

  if (orderSuccess) {
    const formValues = form.getValues();
    return <OrderSuccess formValues={formValues} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Checkout
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <FiShoppingBag className="text-blue-500 dark:text-blue-400" />
                  Your Order ({products.length}{" "}
                  {products.length === 1 ? "item" : "items"})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-6 flex hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                          <FiShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 ml-2">
                          {LkrFormat(Number(product.calculatedPrice))}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {product.retailer}
                      </p>

                      <div className="flex items-center mt-3">
                        <motion.button
                          onClick={() =>
                            handleQuantityChange(
                              index,
                              (product.quantity || 1) - 1
                            )
                          }
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
                        >
                          <FiMinus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </motion.button>
                        <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                          {product.quantity || 1}
                        </span>
                        <motion.button
                          onClick={() =>
                            handleQuantityChange(
                              index,
                              (product.quantity || 1) + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiPlus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </motion.button>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="ml-4 text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {LkrFormat(basePrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {deliveryMethod === "air" ? (
                      <>Air Cargo (1 week)</>
                    ) : (
                      <>Sea Cargo (1 month)</>
                    )}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {deliveryMethod === "air" ? "$10.00" : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {LkrFormat(totalPrice)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Contact Information */}
          <div className="lg:w-1/3">
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 sticky top-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                Contact & Delivery Information
              </h2>

              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    {...form.register("name")}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="John Doe"
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  WhatsApp Number
                </label>
                <div className="relative flex">
                  {/* Country Code */}
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm">
                    +94
                  </span>

                  {/* Mobile Input */}
                  <input
                    type="tel"
                    id="mobile"
                    {...form.register("mobile")}
                    className="block w-full rounded-r-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 pl-3"
                    placeholder="07XXXXXXXX"
                    pattern="^07[0-9]{8}$"
                    title="Enter a valid 10-digit Sri Lankan mobile number"
                  />
                </div>
                {form.formState.errors.mobile && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {form.formState.errors.mobile.message}
                  </p>
                )}
              </div>

              {/* Sri Lankan Address Fields */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Address (Sri Lanka)
                </label>

                <div className="mb-4">
                  <label htmlFor="addressLine1" className="sr-only">
                    Address Line 1
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHome className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="addressLine1"
                      {...form.register("addressLine1")}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      placeholder="Address Line 1 (House No, Street)"
                    />
                  </div>
                  {form.formState.errors.addressLine1 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.addressLine1.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="addressLine2" className="sr-only">
                    Address Line 2
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="addressLine2"
                      {...form.register("addressLine2")}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      placeholder="Address Line 2 (Optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="sr-only">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...form.register("city")}
                      className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      placeholder="City"
                    />
                    {form.formState.errors.city && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="district" className="sr-only">
                      District
                    </label>
                    <select
                      id="district"
                      {...form.register("district")}
                      className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.district && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {form.formState.errors.district.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="postalCode" className="sr-only">
                    Postal Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="postalCode"
                      {...form.register("postalCode")}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      placeholder="Postal Code"
                    />
                  </div>
                  {form.formState.errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="radio"
                      id="sea-cargo"
                      {...form.register("deliveryMethod")}
                      value="sea"
                      className="sr-only"
                    />
                    <label
                      htmlFor="sea-cargo"
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                        form.watch("deliveryMethod") === "sea"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <FiTruck
                        className={`h-6 w-6 ${
                          form.watch("deliveryMethod") === "sea"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <span
                        className={`mt-2 text-sm font-medium ${
                          form.watch("deliveryMethod") === "sea"
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Sea Cargo
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        1 month delivery
                      </span>
                      <span className="text-xs font-medium mt-1 text-gray-800 dark:text-gray-200">
                        {LkrFormat(0)}
                      </span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="air-cargo"
                      {...form.register("deliveryMethod")}
                      value="air"
                      className="sr-only"
                    />
                    <label
                      htmlFor="air-cargo"
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                        form.watch("deliveryMethod") === "air"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <FiPackage
                        className={`h-6 w-6 ${
                          form.watch("deliveryMethod") === "air"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <span
                        className={`mt-2 text-sm font-medium ${
                          form.watch("deliveryMethod") === "air"
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Air Cargo
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        1 week delivery
                      </span>
                      <span className="text-xs font-medium mt-1 text-gray-800 dark:text-gray-200">
                        {LkrFormat(8500)}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Additional Comments (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FiMessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <textarea
                    id="comments"
                    {...form.register("comments")}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="Any special instructions..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="missingItems"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {`Items We Don't Have (Optional)`}
                </label>
                <textarea
                  id="missingItems"
                  {...form.register("missingItems")}
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="List any items you couldn't find..."
                  rows={2}
                />
              </div>

              {/* In the order summary section, replace the current total display with this: */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                {/* Subtotal and Shipping */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {LkrFormat(basePrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {deliveryMethod === "air"
                      ? "Air Cargo (1 week)"
                      : "Sea Cargo (1 month)"}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {deliveryMethod === "air"
                      ? `${LkrFormat(8500)}`
                      : `${LkrFormat(0)}`}
                  </span>
                </div>

                {/* Payment Breakdown */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      Total Amount
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {LkrFormat(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      First Payment (50%)
                    </span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {LkrFormat(totalPrice / 2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Pay 50% now to confirm your order. Remaining 50% due upon
                    arrival in Sri Lanka.
                  </div>
                </div>
              </div>

              {/* Payment Information Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                  <FiInfo className="mr-2" /> Payment Process
                </h3>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc pl-5">
                  <li>
                    First payment of 50% ({LkrFormat(totalPrice / 2)}) required
                    now
                  </li>
                  <li>
                    Final 50% payment ({LkrFormat(totalPrice / 2)}) before
                    delivery
                  </li>
                  <li>{`We'll contact you for payment confirmation`}</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createOrder.isPending || products.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors duration-200 flex items-center justify-center cursor-pointer ${
                  products.length === 0
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                }`}
              >
                {createOrder.isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Pay 50% Now (${LkrFormat(totalPrice / 2)})`
                )}
              </button>

              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                By placing your order, you agree to our terms and conditions
              </p>
            </motion.form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
