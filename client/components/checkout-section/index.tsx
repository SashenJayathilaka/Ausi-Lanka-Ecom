/* eslint-disable @next/next/no-img-element */
"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiShoppingBag,
  FiPhone,
  FiUser,
  FiTruck,
  FiPackage,
  FiMessageSquare,
  FiMapPin,
  FiHome,
  FiGlobe,
} from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";

const CheckoutPage = () => {
  const { products, removeProduct, updateQuantity, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  // Calculate base price
  const basePrice = products.reduce((total, product) => {
    const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, ""));
    const quantity = product.quantity || 1;
    return total + (isNaN(priceValue) ? 0 : priceValue * quantity);
  }, 0);

  // Calculate total price with delivery
  const deliveryFee = formData.deliveryMethod === "air" ? 10 : 0;
  const totalPrice = basePrice + deliveryFee;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(index, newQuantity);
    }
  };

  const handleRemoveItem = (index: number) => {
    removeProduct(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
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
          <p className="text-gray-600 mb-4">
            {`Thank you for your purchase, ${formData.name}. We'll contact you shortly on ${formData.mobile}.`}
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-medium text-blue-800">Delivery Address:</p>
            <p className="text-blue-700">
              {formData.addressLine1}
              <br />
              {formData.addressLine2 && (
                <>
                  {formData.addressLine2}
                  <br />
                </>
              )}
              {formData.city}, {formData.district}
              <br />
              {formData.postalCode}
            </p>
            <p className="font-medium text-blue-800 mt-2">Delivery Method:</p>
            <p className="text-blue-700">
              {formData.deliveryMethod === "air" ? (
                <>Air Cargo (1 week delivery)</>
              ) : (
                <>Sea Cargo (1 month delivery)</>
              )}
            </p>
            {formData.comments && (
              <>
                <p className="font-medium text-blue-800 mt-2">Your Comments:</p>
                <p className="text-blue-700">{formData.comments}</p>
              </>
            )}
            {formData.missingItems && (
              <>
                <p className="font-medium text-blue-800 mt-2">Missing Items:</p>
                <p className="text-blue-700">{formData.missingItems}</p>
              </>
            )}
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500">
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
                          {product.price}
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
                  <span className="font-medium">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    {formData.deliveryMethod === "air" ? (
                      <>Air Cargo (1 week)</>
                    ) : (
                      <>Sea Cargo (1 month)</>
                    )}
                  </span>
                  <span className="font-medium">
                    {formData.deliveryMethod === "air" ? "$10.00" : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${totalPrice.toFixed(2)}
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
              onSubmit={handleSubmit}
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
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
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
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="07X XXX XXXX"
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit Sri Lankan mobile number"
                  />
                </div>
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
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                      placeholder="Address Line 1 (House No, Street)"
                    />
                  </div>
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
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
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
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="district" className="sr-only">
                      District
                    </label>
                    <select
                      id="district"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
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
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Postal Code"
                      pattern="[0-9]{5}"
                      title="Sri Lankan postal code (5 digits)"
                    />
                  </div>
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
                      name="deliveryMethod"
                      value="sea"
                      checked={formData.deliveryMethod === "sea"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="sea-cargo"
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${
                        formData.deliveryMethod === "sea"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <FiTruck
                        className={`h-6 w-6 ${
                          formData.deliveryMethod === "sea"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`mt-2 text-sm font-medium ${
                          formData.deliveryMethod === "sea"
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
                      name="deliveryMethod"
                      value="air"
                      checked={formData.deliveryMethod === "air"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="air-cargo"
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${
                        formData.deliveryMethod === "air"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <FiPackage
                        className={`h-6 w-6 ${
                          formData.deliveryMethod === "air"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`mt-2 text-sm font-medium ${
                          formData.deliveryMethod === "air"
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
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
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
                  name="missingItems"
                  value={formData.missingItems}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List any items you couldn't find..."
                  rows={2}
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
