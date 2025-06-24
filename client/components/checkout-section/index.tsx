/* eslint-disable @next/next/no-img-element */
"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion } from "framer-motion";
import { FiCheckCircle, FiShoppingBag, FiPhone, FiUser } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";

const CheckoutSections = () => {
  const products = useCartStore((state) => state.products);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    shippingMethod: "sea",
    comment: "",
    additionalItems: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalPrice = products.reduce((total, product) => {
    const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, ""));
    return total + (isNaN(priceValue) ? 0 : priceValue);
  }, 0);

  const shippingFee = formData.shippingMethod === "air" ? 10 : 0;
  const grandTotal = totalPrice + shippingFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart();
    }, 1500);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <FiCheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            {`Thank you for your purchase. We'll contact you shortly on ${formData.mobile} to confirm delivery details.`}
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              Order Reference: #{Math.floor(Math.random() * 1000000)}
            </p>
          </div>
          <Link
            href="/"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
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
                          {product.price}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.retailer}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {formData.shippingMethod === "air" ? "$10.00" : "Free"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/3">
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-md overflow-hidden p-6 sticky top-8"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Contact Information
              </h2>

              {/* Full Name */}
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
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Mobile */}
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
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0412 345 678"
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit mobile number"
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="air"
                      checked={formData.shippingMethod === "air"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Air Cargo (+$10, 1 week)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="sea"
                      checked={formData.shippingMethod === "sea"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Sea Cargo (Free, 1 month)
                  </label>
                </div>
              </div>

              {/* Additional Items */}
              <div className="mb-6">
                <label
                  htmlFor="additionalItems"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Items You Need (Not in Catalog)
                </label>
                <input
                  type="text"
                  id="additionalItems"
                  name="additionalItems"
                  value={formData.additionalItems}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Vitamin D drops, herbal tea..."
                />
              </div>

              {/* Comments */}
              <div className="mb-6">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Comments or Special Instructions
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  value={formData.comment}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave any instructions or notes here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || products.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
                  products.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors flex items-center justify-center`}
              >
                {isSubmitting ? (
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
                  `Place Order ($${grandTotal.toFixed(2)})`
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

export default CheckoutSections;
