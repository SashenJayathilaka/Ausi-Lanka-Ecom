/* eslint-disable @next/next/no-img-element */
"use client";

import { addProduct } from "@/store/bucketSlice";
import { fadeIn, staggerContainer, textVariant, slideIn } from "@/utils/motion";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiClipboard,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Bucket from "./bucket";
import { RootState } from "@/store/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ScrapeResult {
  title: string;
  price: string;
  image: string | null;
  url?: string;
  retailer: string;
}

const ChemistWareHouse = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.bucket.products);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBucket, setShowBucket] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setUrl(clipboardText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      setError("Couldn't access clipboard. Please paste manually.");
    }
  };

  const handleScrape = async () => {
    setError(null);
    setData(null);

    if (!url.trim()) {
      setError("Please enter a product URL.");
      return;
    }

    let apiEndpoint;
    let retailer = "";

    if (url.includes("chemistwarehouse.com.au")) {
      apiEndpoint = `http://localhost:5000/api/chemist/scrape?url=${encodeURIComponent(
        url
      )}`;
      retailer = "Chemist Warehouse";
    } else if (url.includes("coles.com.au")) {
      apiEndpoint = `http://localhost:5000/api/coles/scrape?url=${encodeURIComponent(
        url
      )}`;
      retailer = "Coles";
    } else if (url.includes("jbhifi.com.au")) {
      apiEndpoint = `http://localhost:5000/api/jbhifi/scrape?url=${encodeURIComponent(
        url
      )}`;
      retailer = "JB Hi-Fi";
    } else {
      setError(
        "Please enter a valid retailer URL (Chemist Warehouse, Coles, or JB Hi-Fi)."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiEndpoint);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch product data");
      }

      setData({
        title: result.title || "No title found",
        price: result.price || "No price found",
        image: result.image || null,
        url: url,
        retailer: retailer,
      });
    } catch (error) {
      setError((error as Error).message || "An error occurred while scraping");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBucket = () => {
    if (data) {
      dispatch(
        addProduct({
          name: data.title,
          price: data.price,
          image: data.image!,
          url: data.url,
          retailer: data.retailer,
        })
      );
      setUrl("");
      setData(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        handlePaste();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Get retailer logo path
  const getRetailerLogo = (retailer: string) => {
    switch (retailer) {
      case "Coles":
        return "/assets/coles.png";
      case "JB Hi-Fi":
        return "/assets/jbhifi.png";
      case "Chemist Warehouse":
      default:
        return "/assets/partner_chemistwarehouse.webp";
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 md:py-32 overflow-hidden"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div
          variants={staggerContainer()}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              variants={textVariant(0.2)}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                Price Scraper
              </span>
            </motion.h1>

            <motion.p
              variants={textVariant(0.4)}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Find the best deals from top retailers
            </motion.p>

            <motion.div
              variants={fadeIn("up", 0.6)}
              className="relative w-full max-w-2xl mx-auto"
            >
              <div className="flex shadow-lg rounded-full bg-white border border-gray-200">
                <input
                  type="text"
                  className="flex-1 border-0 rounded-l-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                  placeholder="Paste product URL from supported retailers..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                />
                <div className="flex items-center pr-2 space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePaste}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Paste from clipboard"
                  >
                    <FiClipboard className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleScrape}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full m-1 flex items-center justify-center shadow-md"
                  >
                    {loading ? (
                      <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    ) : (
                      <FiChevronRight className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </div>

              {showCopied && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-8 left-0 right-0 text-sm text-blue-500 font-medium"
                >
                  URL pasted from clipboard!
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Scraper Results */}
          <motion.div className="flex-1" variants={fadeIn("right", 0.4)}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Product Details
                </h2>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100 flex items-start"
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <svg
                        className="h-5 w-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {data ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 bg-gray-50 flex items-center justify-center p-6 min-h-64 relative">
                        {/* Retailer Logo */}
                        <div className="absolute top-3 left-3 bg-white/80 rounded-lg p-1 shadow-sm z-10">
                          <img
                            src={getRetailerLogo(data.retailer)}
                            alt={data.retailer}
                            className="h-6 w-auto object-contain"
                          />
                        </div>

                        {data.image ? (
                          <motion.img
                            src={data.image}
                            alt={data.title}
                            className="max-h-64 object-contain"
                            whileHover={{ scale: 1.05 }}
                          />
                        ) : (
                          <div className="w-full h-64 flex items-center justify-center text-gray-400">
                            <FiShoppingCart className="h-16 w-16 opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {data.title}
                        </h3>

                        <div className="flex items-baseline mb-4">
                          <span className="text-3xl font-extrabold text-blue-600">
                            {data.price}
                          </span>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4">
                          <motion.button
                            onClick={handleAddToBucket}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md"
                          >
                            <FiShoppingCart className="h-5 w-5" />
                            <span>Add to Bucket</span>
                          </motion.button>

                          {data.url && (
                            <motion.a
                              href={data.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50"
                            >
                              View Original
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">
                      No product loaded
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Enter a product URL from supported retailers
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handlePaste}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        <FiClipboard className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                        Paste from clipboard
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bucket Sidebar */}
          <motion.div
            variants={slideIn("left", "spring", 0.6, 1)}
            className={`fixed lg:static inset-0 z-50 lg:z-auto bg-white lg:bg-transparent transition-all duration-300 ${
              showBucket ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            } ${showBucket ? "block" : "hidden lg:block"}`}
          >
            <Bucket />
            <button
              onClick={() => setShowBucket(false)}
              className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-6 w-6" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Mobile Bucket Toggle */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowBucket(!showBucket)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-xl z-10 flex items-center justify-center"
      >
        <FiShoppingCart className="h-6 w-6" />
        {products.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
          >
            {products.length}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

export default ChemistWareHouse;
