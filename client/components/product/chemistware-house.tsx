/* eslint-disable @next/next/no-img-element */
"use client";

import { useCartStore } from "@/store/useCartStore";
import { fadeIn, slideIn, staggerContainer, textVariant } from "@/utils/motion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FiChevronRight,
  FiClipboard,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";
import ShippingCountdown from "../home/ShippingCountdown";
import Bucket from "./bucket";

interface ScrapeResult {
  title: string;
  price: string;
  image: string | null;
  url?: string;
  retailer: string;
  calculatedPrice: string;
}

const ChemistWareHouse = () => {
  const products = useCartStore((state) => state.products);
  const addProduct = useCartStore((state) => state.addProduct);

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBucket, setShowBucket] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Supported retailers data
  const supportedRetailers = [
    {
      name: "Chemist Warehouse",
      url: "https://www.chemistwarehouse.com.au/",
      logo: "/assets/partner_chemistwarehouse.webp",
    },
    {
      name: "Coles",
      url: "https://www.coles.com.au/",
      logo: "/assets/coles.png",
    },
    {
      name: "Woolworths",
      url: "https://www.woolworths.com.au/",
      logo: "/assets/woolworths.png",
    },
    {
      name: "JB Hi-Fi",
      url: "https://www.jbhifi.com.au/",
      logo: "/assets/jbhifi.png",
    },
    {
      name: "Officeworks",
      url: "https://www.officeworks.com.au/",
      logo: "/assets/officeworks.png",
    },
  ];

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setUrl(clipboardText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);

        // Automatically start scraping after paste
        setError(null);
        if (isValidUrl(clipboardText)) {
          await handleScrape(clipboardText);
        }
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      setError("Couldn't access clipboard. Please paste manually.");
    }
  };

  const isValidUrl = (url: string) => {
    return supportedRetailers.some((retailer) =>
      url.includes(new URL(retailer.url).hostname)
    );
  };

  const handleScrape = async (scrapeUrl?: string) => {
    const targetUrl = scrapeUrl || url;
    setError(null);
    setData(null);

    if (!targetUrl.trim()) {
      setError("Please enter a product URL.");
      return;
    }

    let apiEndpoint;
    let retailer = "";

    if (targetUrl.includes("chemistwarehouse.com.au")) {
      apiEndpoint = `http://localhost:5000/api/chemist/scrape?url=${encodeURIComponent(
        targetUrl
      )}`;
      retailer = "Chemist Warehouse";
    } else if (targetUrl.includes("coles.com.au")) {
      apiEndpoint = `http://localhost:5000/api/coles/scrape?url=${encodeURIComponent(
        targetUrl
      )}`;
      retailer = "Coles";
    } else if (targetUrl.includes("woolworths.com.au")) {
      apiEndpoint = `http://localhost:5000/api/woolworths/scrape?url=${encodeURIComponent(
        targetUrl
      )}`;
      retailer = "Woolworths";
    } else if (targetUrl.includes("jbhifi.com.au")) {
      apiEndpoint = `http://localhost:5000/api/jbhifi/scrape?url=${encodeURIComponent(
        targetUrl
      )}`;
      retailer = "JB Hi-Fi";
    } else if (targetUrl.includes("officeworks.com.au")) {
      apiEndpoint = `http://localhost:5000/api/officeworks/scrape?url=${encodeURIComponent(
        targetUrl
      )}`;
      retailer = "Officeworks";
    } else {
      setError(
        "Please enter a valid retailer URL (Chemist Warehouse, Coles, Woolworths, JB Hi-Fi, or Officeworks)."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiEndpoint);
      const result = await response.json();
      console.log("🚀 ~ handleScrape ~ result :", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch product data");
      }

      setData({
        title: result.title || "No title found",
        price: result.price || "No price found",
        image: result.image || null,
        url: targetUrl,
        retailer: retailer,
        calculatedPrice: result.calculatedPrice,
      });
    } catch (error) {
      setError((error as Error).message || "An error occurred while scraping");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBucket = () => {
    if (data) {
      addProduct({
        name: data.title,
        price: data.price,
        image: data.image!,
        url: data.url,
        retailer: data.retailer,
        calculatedPrice: data.calculatedPrice,
      });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get retailer logo path
  const getRetailerLogo = (retailer: string) => {
    const foundRetailer = supportedRetailers.find((r) => r.name === retailer);
    return foundRetailer
      ? foundRetailer.logo
      : "/assets/partner_chemistwarehouse.webp";
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Enhanced Hero Section */}
      <motion.section
        className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* New gradient background */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] bg-[length:60px_60px] opacity-10"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-400 rounded-full filter blur-[100px] opacity-30"></div>
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-400 rounded-full filter blur-[100px] opacity-30"></div>
          <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
        </div>

        <motion.div
          variants={staggerContainer()}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              variants={textVariant(0.2)}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                Smart Price Scraper
              </span>
            </motion.h1>

            <motion.p
              variants={textVariant(0.4)}
              className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            >
              {`Find the best deals from Australia's top retailers`}
            </motion.p>

            {/* Countdown Timer - Moved up below the subtitle */}
            <motion.div variants={fadeIn("up", 0.5)} className="mb-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <ShippingCountdown
                  targetDate="2025-06-28T10:00:00"
                  className="ml-2 font-bold text-white"
                />
              </div>
            </motion.div>

            {/* Enhanced URL Input Field */}
            <motion.div
              variants={fadeIn("up", 0.6)}
              className="relative w-full max-w-2xl mx-auto"
            >
              <div className="flex shadow-2xl rounded-lg bg-white/95 backdrop-blur-sm border-2 border-blue-300/50">
                <input
                  type="text"
                  className="flex-1 border-0 rounded-l-lg px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 bg-transparent text-lg"
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
                    className="p-3 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Paste from clipboard"
                  >
                    <FiClipboard className="h-6 w-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleScrape()}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-r-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <AiOutlineLoading3Quarters className="animate-spin h-6 w-6" />
                    ) : (
                      <>
                        <span className="mr-2 font-medium">Scrape</span>
                        <FiChevronRight className="h-6 w-6" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {showCopied && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-8 left-0 right-0 text-sm text-blue-200 font-medium"
                >
                  URL pasted from clipboard!
                </motion.div>
              )}
            </motion.div>

            {/* Supported Retailers Section */}
            <motion.div variants={fadeIn("up", 0.8)} className="mt-12">
              <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-4">
                Supported Retailers
              </h3>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {supportedRetailers.map((retailer, index) => (
                  <motion.a
                    key={retailer.name}
                    href={retailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center group"
                    variants={fadeIn("up", 0.5 + index * 0.1)}
                  >
                    <div className="bg-white p-3 rounded-lg shadow-md group-hover:shadow-lg transition-all w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                      <img
                        src={retailer.logo}
                        alt={retailer.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="mt-2 text-sm font-medium text-white group-hover:text-blue-200 transition-colors">
                      {retailer.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        />
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
          {/* Enhanced Scraper Results Section */}
          <motion.div className="flex-1" variants={fadeIn("right", 0.4)}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100">
              <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                    Product Details
                  </span>
                  <span className="ml-2 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </h2>
                <p className="text-blue-600">
                  View and manage scraped product information
                </p>
              </div>

              <div className="p-6 md:p-8">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start shadow-sm"
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <svg
                        className="h-5 w-5 text-red-500"
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
                    className="border-2 border-blue-100 rounded-xl overflow-hidden shadow-lg"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center p-6 min-h-64 relative">
                        {/* Retailer Logo */}
                        <div className="absolute top-3 left-3 bg-white rounded-lg p-1 shadow-md z-10 border border-gray-200">
                          <img
                            src={getRetailerLogo(data.retailer)}
                            alt={data.retailer}
                            className="h-8 w-auto object-contain"
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
                      <div className="p-6 md:w-2/3 bg-white">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {data.title}
                        </h3>

                        <div className="flex items-baseline mb-6">
                          <span className="text-4xl font-extrabold text-blue-600">
                            {data.calculatedPrice}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            AUD
                          </span>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                          <motion.button
                            onClick={handleAddToBucket}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
                          >
                            <FiShoppingCart className="h-6 w-6" />
                            <span className="font-semibold text-lg">
                              Add to Bucket
                            </span>
                          </motion.button>

                          {data.url && (
                            <motion.a
                              href={data.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="flex-1 border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 hover:border-blue-200 transition-all"
                            >
                              <span className="font-medium">View Original</span>
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
                    className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200"
                  >
                    <div className="mx-auto h-24 w-24 text-blue-300 mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      No product loaded
                    </h3>
                    <p className="mt-1 text-gray-600 max-w-md mx-auto">
                      Enter a product URL from supported retailers above to view
                      detailed product information
                    </p>
                    <div className="mt-8">
                      <button
                        onClick={handlePaste}
                        className="inline-flex items-center px-6 py-3 border-2 border-blue-200 shadow-sm text-lg font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 focus:outline-none transition-all"
                      >
                        <FiClipboard className="mr-3 h-6 w-6 text-blue-400" />
                        Paste from clipboard
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Bucket Sidebar */}
          <motion.div
            variants={slideIn("left", "spring", 0.6, 1)}
            className={`fixed lg:static inset-0 z-50 lg:z-auto bg-white lg:bg-transparent transition-all duration-300 ${
              showBucket ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            } ${showBucket ? "block" : "hidden lg:block"}`}
          >
            <div className="h-full lg:h-auto flex flex-col bg-white lg:rounded-2xl lg:shadow-xl lg:border-2 lg:border-blue-100 overflow-hidden">
              <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                    Your Shopping Bucket
                  </span>
                  {products.length > 0 && (
                    <span className="ml-3 bg-blue-600 text-white text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center">
                      {products.length}
                    </span>
                  )}
                </h2>
                <p className="text-blue-600">Manage your selected products</p>
              </div>
              <Bucket />
              <button
                onClick={() => setShowBucket(false)}
                className="lg:hidden absolute top-6 right-6 p-2 text-gray-500 hover:text-gray-700 bg-white rounded-full shadow-md"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Mobile Bucket Toggle */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowBucket(!showBucket)}
        className="lg:hidden fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-full shadow-2xl z-10 flex items-center justify-center"
      >
        <FiShoppingCart className="h-8 w-8" />
        {products.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center"
          >
            {products.length}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

export default ChemistWareHouse;
