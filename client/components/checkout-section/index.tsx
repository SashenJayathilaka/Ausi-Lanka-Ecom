/* eslint-disable @next/next/no-img-element */
"use client";

import { useCartStore } from "@/store/useCartStore";
import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiAlertTriangle,
  FiAnchor,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiHome,
  FiMapPin,
  FiMessageSquare,
  FiPackage,
  FiPhone,
  FiShoppingBag,
  FiTruck,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema for form validation
const checkoutFormSchema = z.object({
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

// Sri Lankan districts
const districts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

const CheckoutPage = () => {
  //const { user } = useUser();
  const router = useRouter();
  const clerk = useClerk();
  const { products, removeProduct, updateQuantity, clearCart } = useCartStore();
  const [orderSuccess, setOrderSuccess] = useState(false);

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
    onSuccess: (data) => {
      clearCart();
      setOrderSuccess(true);
      toast.success(data.message);
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
  const deliveryFee = deliveryMethod === "air" ? 10 : 0;
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
                href="/"
                className="inline-flex w-full items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl gap-2"
              >
                Continue Shopping <FiShoppingBag className="h-5 w-5" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
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
              className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiShoppingBag className="text-blue-500" />
                  Your Order ({products.length}{" "}
                  {products.length === 1 ? "item" : "items"})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {products.map((product, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-6 flex"
                  >
                    <div className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <FiShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm font-semibold text-gray-800 ml-2">
                          {LkrFormat(Number(product.calculatedPrice))}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.retailer}
                      </p>

                      <div className="flex items-center mt-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              index,
                              (product.quantity || 1) - 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                          {product.quantity || 1}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              index,
                              (product.quantity || 1) + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="ml-4 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{LkrFormat(basePrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    {deliveryMethod === "air" ? (
                      <>Air Cargo (1 week)</>
                    ) : (
                      <>Sea Cargo (1 month)</>
                    )}
                  </span>
                  <span className="font-medium">
                    {deliveryMethod === "air" ? "$10.00" : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-blue-600">
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
              className="bg-white rounded-xl shadow-md overflow-hidden p-6 sticky top-8"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Contact & Delivery Information
              </h2>

              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    {...form.register("name")}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    {...form.register("mobile")}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="07X XXX XXXX"
                  />
                </div>
                {form.formState.errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.mobile.message}
                  </p>
                )}
              </div>

              {/* Sri Lankan Address Fields */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address (Sri Lanka)
                </label>

                <div className="mb-4">
                  <label htmlFor="addressLine1" className="sr-only">
                    Address Line 1
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHome className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="addressLine1"
                      {...form.register("addressLine1")}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                      placeholder="Address Line 1 (House No, Street)"
                    />
                  </div>
                  {form.formState.errors.addressLine1 && (
                    <p className="mt-1 text-sm text-red-600">
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
                      <FiMapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="addressLine2"
                      {...form.register("addressLine2")}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                    />
                    {form.formState.errors.city && (
                      <p className="mt-1 text-sm text-red-600">
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
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.district && (
                      <p className="mt-1 text-sm text-red-600">
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
                      <FiGlobe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="postalCode"
                      {...form.register("postalCode")}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Postal Code"
                    />
                  </div>
                  {form.formState.errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${
                        form.watch("deliveryMethod") === "sea"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <FiTruck
                        className={`h-6 w-6 ${
                          form.watch("deliveryMethod") === "sea"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`mt-2 text-sm font-medium ${
                          form.watch("deliveryMethod") === "sea"
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        Sea Cargo
                      </span>
                      <span className="text-xs text-gray-500">
                        1 month delivery
                      </span>
                      <span className="text-xs font-medium mt-1">$0.00</span>
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
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${
                        form.watch("deliveryMethod") === "air"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <FiPackage
                        className={`h-6 w-6 ${
                          form.watch("deliveryMethod") === "air"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`mt-2 text-sm font-medium ${
                          form.watch("deliveryMethod") === "air"
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        Air Cargo
                      </span>
                      <span className="text-xs text-gray-500">
                        1 week delivery
                      </span>
                      <span className="text-xs font-medium mt-1">+$10.00</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Comments (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FiMessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="comments"
                    {...form.register("comments")}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special instructions..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="missingItems"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {`Items We Don't Have (Optional)`}
                </label>
                <textarea
                  id="missingItems"
                  {...form.register("missingItems")}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List any items you couldn't find..."
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={createOrder.isPending || products.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
                  products.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors flex items-center justify-center`}
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
                  `Place Order ($${totalPrice.toFixed(2)})`
                )}
              </button>

              <p className="mt-4 text-xs text-gray-500 text-center">
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
