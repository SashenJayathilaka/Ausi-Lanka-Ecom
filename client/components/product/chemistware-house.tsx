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
import {
  RiClipboardLine,
  RiPriceTag3Line,
  RiShoppingBasketLine,
} from "react-icons/ri";
import { toast } from "sonner";
import ShippingCountdown from "../home/ShippingCountdown";
import Bucket from "./bucket";
import { trpc } from "@/trpc/client";
import { supportedRetailers } from "@/lib/retailers";

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
  console.log("🚀 ~ ChemistWareHouse ~ showCopied:", showCopied);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [scrapingStep, setScrapingStep] = useState<string>("");
  const [isSticky, setIsSticky] = useState(false);
  const [autoScrapeEnabled, setAutoScrapeEnabled] = useState(true);
  const [urlValidation, setUrlValidation] = useState<
    "valid" | "invalid" | "empty"
  >("empty");

  // Supported retailers data with color schemes
  // Supported retailers data with color schemes
  // Imported from @/lib/retailers

  const scrapeMutation = trpc.productScrapeRouter.scrapeProduct.useMutation();

  useEffect(() => {
    setMounted(true);
    setIsLoading(false);

    // Sticky bar scroll listener
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText) {
        toast.error("No text found in clipboard");
        return;
      }

      setUrl(clipboardText);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);

      if (isValidUrl(clipboardText)) {
        // Auto-scrape if enabled
        if (autoScrapeEnabled) {
          toast.success("Valid URL detected! Starting analysis...", {
            duration: 2000,
          });
          await handleScrape(clipboardText);
        } else {
          toast.success("Valid URL pasted! Click Analyze to continue.");
        }
      } else {
        toast.warning("Clipboard doesn't contain a supported retailer URL");
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      toast.error("Couldn't access clipboard. Please paste manually.");
    }
  };

  const isValidUrl = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return supportedRetailers.some(
        (retailer) => urlObj.hostname === new URL(retailer.url).hostname
      );
    } catch {
      return false;
    }
  };

  const handleScrape = async (scrapeUrl?: string) => {
    const targetUrl = scrapeUrl || url;
    setError(null);
    setData(null);

    if (!targetUrl.trim()) {
      toast.error("Please enter a product URL.");
      return;
    }

    if (!isValidUrl(targetUrl)) {
      toast.error("Unsupported retailer URL");
      return;
    }

    setLoading(true);
    setScrapingStep("Fetching product data...");

    try {
      // Simulate progress steps
      setTimeout(() => setScrapingStep("Analyzing product details..."), 800);
      setTimeout(() => setScrapingStep("Calculating LKR price..."), 1600);

      const result = await scrapeMutation.mutateAsync({ url: targetUrl });

      if (result.success && result.data) {
        setScrapingStep("Complete!");
        setData(result.data);
        toast.success("Product data analyzed successfully!");
      } else {
        throw new Error(result.error || "Failed to scrape product");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while scraping";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setTimeout(() => setScrapingStep(""), 1000);
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
      toast.success("Product added to your collection!");
    }
  };

  // Real-time URL validation
  useEffect(() => {
    if (!url.trim()) {
      setUrlValidation("empty");
    } else if (isValidUrl(url)) {
      setUrlValidation("valid");
    } else {
      setUrlValidation("invalid");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        handlePaste();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePaste]);

  const getRetailerData = (retailer: string) => {
    return (
      supportedRetailers.find((r) => r.name === retailer) ||
      supportedRetailers[0]
    );
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer()}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Sticky Compact Search Bar */}
      <AnimatePresence>
        {isSticky && !loading && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-all"
                    placeholder="Paste product URL for instant analysis..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                    disabled={loading}
                  />
                  {urlValidation === "valid" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Valid
                      </span>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                  )}
                  {urlValidation === "invalid" && url.length > 10 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Invalid URL
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handlePaste}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-all flex items-center gap-2"
                >
                  <FiClipboard className="h-4 w-4" />
                  Paste
                </button>
                <button
                  onClick={() => handleScrape()}
                  disabled={loading || urlValidation !== "valid"}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 disabled:cursor-not-allowed"
                >
                  <span>Analyze</span>
                  <RiPriceTag3Line className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-24 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          className="relative rounded-3xl overflow-hidden mb-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer()}
        >
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90 animate-gradient-x"></div>
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] bg-[length:60px_60px] opacity-10 dark:opacity-5"></div>
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
                {`Extract prices, compare deals, and save money across Australia's
                top retailers`}
              </p>
            </motion.div>

            <motion.div variants={fadeIn("up", 0.4)} className="mt-8 max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    className="w-full px-6 py-4 pr-24 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-white/50 focus:ring-4 focus:ring-white/10 text-white placeholder-blue-100/80 font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/30 focus:shadow-2xl focus:bg-white/30"
                    placeholder="Paste product URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                    aria-label="Product URL input"
                    disabled={loading}
                  />
                  {urlValidation === "valid" && !loading && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-16 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-green-500/20 backdrop-blur-sm px-2.5 py-1 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-xs text-white font-semibold">
                        Valid
                      </span>
                    </motion.div>
                  )}
                  {urlValidation === "invalid" &&
                    url.length > 10 &&
                    !loading && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-16 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-red-500/20 backdrop-blur-sm px-2.5 py-1 rounded-lg"
                      >
                        <FiX className="w-3 h-3 text-red-300" />
                        <span className="text-xs text-white font-semibold">
                          Invalid
                        </span>
                      </motion.div>
                    )}
                  <motion.button
                    onClick={handlePaste}
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-blue-100 hover:text-white transition-colors bg-white/10 rounded-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Paste from clipboard"
                    aria-label="Paste URL from clipboard"
                    disabled={loading}
                  >
                    <FiClipboard className="h-5 w-5" />
                    <span className="sr-only">Paste</span>
                  </motion.button>
                  <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 group-focus-within:bg-blue-400/10 group-focus-within:shadow-[0_0_20px_5px_rgba(96,165,250,0.3)]" />
                </div>
                <button
                  onClick={() => handleScrape()}
                  disabled={loading || urlValidation !== "valid"}
                  className="px-6 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex flex-col items-center gap-1">
                      <AiOutlineLoading3Quarters className="animate-spin h-6 w-6" />
                      {scrapingStep && (
                        <span className="text-xs font-normal">
                          {scrapingStep}
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <RiPriceTag3Line className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <ShippingCountdown className="text-white font-medium" />
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoScrapeEnabled}
                      onChange={(e) => setAutoScrapeEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 bg-white/20 text-indigo-600 focus:ring-2 focus:ring-white/50"
                    />
                    <span className="text-sm text-white font-medium">
                      Auto-analyze on paste
                    </span>
                  </label>
                </div>
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
                <motion.div
                  key={retailer.name}
                  variants={fadeIn("up", 0.2 + index * 0.1)}
                  whileHover={{ y: -5 }}
                  className={`group rounded-xl overflow-hidden shadow-md ${retailer.bgColor} dark:border dark:border-gray-700/50 cursor-pointer relative`}
                >
                  <a
                    href={retailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="p-4 flex flex-col items-center">
                      <div className="w-16 h-16 mb-3 flex items-center justify-center">
                        <img
                          src={retailer.logo}
                          alt={retailer.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {retailer.name}
                      </span>
                    </div>
                  </a>
                  {/* Tooltip with example URL */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                      <div className="font-semibold mb-1">Example URL:</div>
                      <div className="text-gray-300 dark:text-gray-400 text-[10px] font-mono">
                        {retailer.exampleUrl}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Results Card */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
              initial="hidden"
              whileInView="show"
              variants={fadeIn("up", 0.4)}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  <RiPriceTag3Line className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  Product Analysis
                </h2>
              </div>

              <div className="p-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700/50 flex items-start"
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
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Error
                      </h3>
                      <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                        <p>{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {data ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700/30 p-6 flex items-center justify-center relative">
                        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md z-10 border border-gray-200 dark:border-gray-600">
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
                          <div className="w-full h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <FiShoppingCart className="h-16 w-16 opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {data.title}
                        </h3>

                        <div className="flex items-baseline mb-2">
                          <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            {LkrFormat(Number(data?.calculatedPrice || 0))}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            LKR
                          </span>
                        </div>

                        {/* Added note about sea cargo shipment */}
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Price includes our standard sea cargo shipment fee
                          </p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                          <motion.button
                            onClick={handleAddToBucket}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all cursor-pointer"
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
                              className="flex-1 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-400 transition-all"
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
                    className="text-center py-16 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 relative"
                  >
                    <div className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-500 mb-6">
                      <RiPriceTag3Line className="h-full w-full" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No product analyzed yet
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
                      Paste a product URL from any supported retailer above to
                      get started
                    </p>

                    <button
                      onClick={handlePaste}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      {loading ? (
                        <AiOutlineLoading3Quarters className="animate-spin h-6 w-6" />
                      ) : (
                        <>
                          <RiClipboardLine className="mr-2" />
                          Paste URL
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Note: You may need to grant clipboard permissions
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Shopping Bucket */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 sticky top-8 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80"
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
              <motion.div
                className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 relative overflow-hidden"
                whileHover={{ backgroundPosition: "100% 50%" }}
              >
                <div className="absolute inset-0 opacity-10 dark:opacity-5"></div>{" "}
                {/*  bg-[url('/assets/dot-pattern.svg')] bg-[size:20px_20px] */}
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
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {products.length > 0
                        ? "Your curated selection"
                        : "Ready for your favorites"}
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="relative">
                <Bucket />
              </div>

              {/*               {products.length > 0 && (
                <motion.div
                  className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-gray-200/50 dark:border-gray-700/50 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Free shipping on orders over $50
                  </p>
                </motion.div>
              )} */}
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
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900 lg:hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                  <RiShoppingBasketLine className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  Your Collection
                </h2>
                <button
                  onClick={() => setShowBucket(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
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
              className="absolute rounded-full bg-indigo-100 dark:bg-indigo-900/20 opacity-10"
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
