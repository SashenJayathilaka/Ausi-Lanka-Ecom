/* eslint-disable @next/next/no-img-element */
"use client";

import { useWindowSize } from "@/hooks/useWindowSize";
import { useCartStore } from "@/store/useCartStore";
import { LkrFormat } from "@/utils/format";
import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FiClipboard,
  FiExternalLink,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";
import { RiPriceTag3Line, RiShoppingBasketLine } from "react-icons/ri";
import { toast } from "sonner";
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
  const { width, height } = useWindowSize();
  const products = useCartStore((state) => state.products);
  const addProduct = useCartStore((state) => state.addProduct);

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBucket, setShowBucket] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Supported retailers data with color schemes
  const supportedRetailers = [
    {
      name: "Chemist Warehouse",
      url: "https://www.chemistwarehouse.com.au/",
      logo: "/assets/partner_chemistwarehouse.webp",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      name: "Coles",
      url: "https://www.coles.com.au/",
      logo: "/assets/coles.png",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-100",
    },
    {
      name: "Woolworths",
      url: "https://www.woolworths.com.au/",
      logo: "/assets/woolworths.png",
      color: "from-green-600 to-green-700",
      bgColor: "bg-green-100",
    },
    {
      name: "JB Hi-Fi",
      url: "https://www.jbhifi.com.au/",
      logo: "/assets/jbhifi.png",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Officeworks",
      url: "https://www.officeworks.com.au/",
      logo: "/assets/officeworks.png",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();

      toast.success("URL pasted from clipboard!");

      if (clipboardText) {
        setUrl(clipboardText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);

        if (isValidUrl(clipboardText)) {
          await handleScrape(clipboardText);
        }

        console.log(showCopied);
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
      apiEndpoint = `http://localhost:5000/api/woolworths/scrape?url==${encodeURIComponent(
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
        "Unsupported retailer. We support: Chemist Warehouse, Coles, Woolworths, JB Hi-Fi, and Officeworks."
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
        url: targetUrl,
        retailer: retailer,
        calculatedPrice: result.calculatedPrice,
      });

      toast.success("Product data analyze successfully!");
    } catch (error) {
      setError((error as Error).message || "An error occurred while scraping");
      toast.error("Failed to analyze product data. Please try again.");
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

  const amount = 19395.0;
  const formatted = `Rs. ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  console.log(formatted); // Rs. 19,395.00

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

  const getRetailerData = (retailer: string) => {
    return (
      supportedRetailers.find((r) => r.name === retailer) ||
      supportedRetailers[0]
    );
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer()}
      className="min-h-screen bg-gray-50 relative overflow-hidden"
    >
      {/* Futuristic Glass Navigation */}
      {/*       <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <RiFlaskLine className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PriceAlchemy
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                className={`px-3 py-2 rounded-lg font-medium ${
                  activeTab === "scraper"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("scraper")}
              >
                Product Scraper
              </button>
              <button
                className={`px-3 py-2 rounded-lg font-medium ${
                  activeTab === "trends"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("trends")}
              >
                Price Trends
              </button>
              <button
                className={`px-3 py-2 rounded-lg font-medium ${
                  activeTab === "deals"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("deals")}
              >
                Hot Deals
              </button>
            </div>

            <button
              onClick={() => setShowBucket(true)}
              className="relative p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50"
            >
              <RiShoppingBasketLine className="h-5 w-5 text-gray-700" />
              {products.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {products.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.nav> */}

      {/* Main Content */}
      <div className="pt-24 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Floating Elements */}
        <motion.section
          className="relative rounded-3xl overflow-hidden mb-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer()}
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90 animate-gradient-x"></div>
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] bg-[length:60px_60px] opacity-10"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-400 rounded-full filter blur-[120px] opacity-30 animate-float"></div>
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-400 rounded-full filter blur-[120px] opacity-30 animate-float-delay"></div>
          </div>

          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            <motion.div variants={textVariant(0.2)}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  Smart Shopping, Simplified
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                {`    Extract prices, compare deals, and save money across Australia's
                top retailers`}
              </p>
            </motion.div>

            <motion.div variants={fadeIn("up", 0.4)} className="mt-8 max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                  {/* Main Input Field */}
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-white/50 focus:ring-4 focus:ring-white/10 text-white placeholder-blue-100/80 font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/30 focus:shadow-2xl focus:bg-white/30"
                    placeholder="Paste product URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                    aria-label="Product URL input"
                  />

                  {/* Paste Button */}
                  <motion.button
                    onClick={handlePaste}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-blue-100 hover:text-white transition-colors bg-white/10 rounded-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Paste from clipboard"
                    aria-label="Paste URL from clipboard"
                  >
                    <FiClipboard className="h-5 w-5" />
                    <span className="sr-only">Paste</span>
                  </motion.button>

                  {/* Glow Effect (only when focused) */}
                  <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 group-focus-within:bg-blue-400/10 group-focus-within:shadow-[0_0_20px_5px_rgba(96,165,250,0.3)]" />
                </div>
                <button
                  onClick={() => handleScrape()}
                  disabled={loading}
                  className="px-6 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:bg-gray-100"
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin h-6 w-6" />
                  ) : (
                    <>
                      <span>Analyze</span>
                      <RiPriceTag3Line className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center justify-between">
                {/*                 {showCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-white font-medium bg-white/20 px-3 py-1 rounded-full"
                  >
                    URL pasted from clipboard!
                  </motion.div>
                )} */}
                <ShippingCountdown
                  targetDate="2025-07-28T10:00:00"
                  className="text-white font-medium"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Retailer Cards */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
              initial="hidden"
              whileInView="show"
              variants={staggerContainer()}
              viewport={{ once: true }}
            >
              {supportedRetailers.map((retailer, index) => (
                <motion.a
                  key={retailer.name}
                  href={retailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeIn("up", 0.2 + index * 0.1)}
                  whileHover={{ y: -5 }}
                  className={`group rounded-xl overflow-hidden shadow-md ${retailer.bgColor}`}
                >
                  <div className="p-4 flex flex-col items-center">
                    <div className="w-16 h-16 mb-3 flex items-center justify-center">
                      <img
                        src={retailer.logo}
                        alt={retailer.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                      {retailer.name}
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* Results Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
              initial="hidden"
              whileInView="show"
              variants={fadeIn("up", 0.4)}
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <RiPriceTag3Line className="mr-2 text-indigo-600" />
                  Product Analysis
                </h2>
              </div>

              <div className="p-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start"
                  >
                    <div className="flex-shrink-0">
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
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center relative">
                        <div className="absolute top-4 left-4 bg-white rounded-lg p-1 shadow-md z-10 border border-gray-200">
                          <img
                            src={getRetailerData(data.retailer).logo}
                            alt={data.retailer}
                            className="h-8 w-auto object-contain"
                          />
                        </div>

                        {data.image ? (
                          <motion.img
                            src={data.image}
                            alt={data.title}
                            className="max-h-64 object-contain rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          />
                        ) : (
                          <div className="w-full h-64 flex items-center justify-center text-gray-400">
                            <FiShoppingCart className="h-16 w-16 opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {data.title}
                        </h3>

                        <div className="flex items-baseline mb-6">
                          <span className="text-4xl font-extrabold text-indigo-600">
                            {LkrFormat(Number(data?.calculatedPrice || 0))}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            LKR
                          </span>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                          <motion.button
                            onClick={handleAddToBucket}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                          >
                            <RiShoppingBasketLine className="h-6 w-6" />
                            <span className="font-semibold text-lg">
                              Add to Collection
                            </span>
                          </motion.button>

                          {data.url && (
                            <motion.a
                              href={data.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="flex-1 border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 hover:border-indigo-200 transition-all"
                            >
                              <FiExternalLink className="h-5 w-5" />
                              <span className="font-medium">View Product</span>
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
                    className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
                  >
                    <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
                      <RiPriceTag3Line className="h-full w-full" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      No product analyzed yet
                    </h3>
                    <p className="mt-1 text-gray-600 max-w-md mx-auto">
                      Paste a product URL from any supported retailer above to
                      get started
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Shopping Bucket */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 sticky top-8 backdrop-blur-sm bg-opacity-80"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              variants={{
                hidden: {
                  opacity: 0,
                  x: 50,
                  rotate: 2,
                },
                show: {
                  opacity: 1,
                  x: 0,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: 0.3,
                  },
                },
              }}
            >
              {/* Floating background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full filter blur-[100px] opacity-10"></div>
              </div>

              {/* Header with gradient background */}
              <motion.div
                className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden"
                whileHover={{ backgroundPosition: "100% 50%" }}
              >
                <div className="absolute inset-0 bg-[url('/assets/dot-pattern.svg')] bg-[size:20px_20px] opacity-10"></div>
                <div className="relative z-10 flex items-center">
                  <motion.div
                    className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md mr-4"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <RiShoppingBasketLine className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      Your Collection
                      {products.length > 0 && (
                        <motion.span
                          className="ml-3 bg-indigo-600 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                          }}
                        >
                          {products.length}
                        </motion.span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {products.length > 0
                        ? "Your curated selection"
                        : "Ready for your favorites"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Cart content with subtle pattern */}
              <div className="relative">
                <Bucket />
              </div>

              {/* Decorative footer */}
              {products.length > 0 && (
                <motion.div
                  className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-t border-gray-200/50 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xs text-gray-500">
                    Free shipping on orders over $50
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Bucket Toggle */}
      <AnimatePresence>
        {!showBucket && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setShowBucket(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center"
          >
            <RiShoppingBasketLine className="h-6 w-6" />
            {products.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {products.length}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Bucket Panel */}
      <AnimatePresence>
        {showBucket && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed inset-0 z-50 bg-white lg:hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <RiShoppingBasketLine className="mr-2 text-indigo-600" />
                  Your Collection
                </h2>
                <button
                  onClick={() => setShowBucket(false)}
                  className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Bucket />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {width > 0 &&
          height > 0 &&
          [...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-100 opacity-10"
              initial={{
                x: Math.random() * width,
                y: Math.random() * height,
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
              }}
              animate={{
                x: [
                  Math.random() * width,
                  Math.random() * width,
                  Math.random() * width,
                ],
                y: [
                  Math.random() * height,
                  Math.random() * height,
                  Math.random() * height,
                ],
              }}
              transition={{
                duration: Math.random() * 50 + 50,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
      </div>
    </motion.div>
  );
};

export default ChemistWareHouse;
