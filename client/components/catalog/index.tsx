"use client";

import { DEFAULT_LIMIT } from "@/constants/constants";
import { useCartStore } from "@/store/useCartStore";
import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { Suspense, useState } from "react";
import {
  FaBreadSlice,
  FaFirstAid,
  FaGamepad,
  FaGift,
  FaHome,
  FaLaptop,
  FaRunning,
  FaSmile,
} from "react-icons/fa";
import { FiExternalLink, FiSearch, FiShoppingCart } from "react-icons/fi";
import { toast } from "sonner";
import { LoadingSpinner } from "../home/ShippingCountdown";
import { ErrorBoundary } from "react-error-boundary";

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

const CatalogSection = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <AusiLkCatalogSuspenseSection />
      </ErrorBoundary>
    </Suspense>
  );
};

export default CatalogSection;

const ErrorFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="bg-red-100 text-red-800 p-4 rounded-lg">
      Failed to load Catalog
    </div>
  </div>
);

const categoryColors: Record<string, string> = {
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  orange:
    "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  yellow:
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  teal: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
};

const AusiLkCatalogSuspenseSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const addProduct = useCartStore((state) => state.addProduct);

  const { data, isLoading } = trpc.getAdminItems.getAllTrendingItems.useQuery(
    { limit: DEFAULT_LIMIT },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const categories: Category[] = [
    {
      id: 1,
      name: "Pharmacy Item",
      icon: <FaFirstAid className="text-2xl" />,
      count:
        data?.items.filter((item) => item.category === "Pharmacy Item")
          .length || 0,
      color: "emerald", // green
    },
    {
      id: 2,
      name: "Supermarket Item",
      icon: <FaBreadSlice className="text-2xl" />,
      count:
        data?.items.filter((item) => item.category === "Supermarket Item")
          .length || 0,
      color: "amber", // amber/orange
    },
    {
      id: 3,
      name: "Electronic Item",
      icon: <FaLaptop className="text-2xl" />,
      count:
        data?.items.filter((item) => item.category === "Electronic Item")
          .length || 0,
      color: "blue", // blue
    },
    {
      id: 4,
      name: "Gift Item",
      icon: <FaGift className="text-2xl" />,
      count:
        data?.items.filter((item) => item.category === "Gift Item").length || 0,
      color: "rose", // red/pink
    },
    {
      id: 5,
      name: "Home & Kitchen",
      icon: <FaHome className="text-2xl" />,
      count:
        data?.items.filter((item) => item.category === "Home & Kitchen")
          .length || 0,
      color: "orange", // orange
    },
    {
      id: 6,
      name: "Beauty & Personal Care",
      icon: <FaSmile className="text-2xl" />,
      count:
        data?.items.filter((item) => item.category === "Beauty & Personal Care")
          .length || 0,
      color: "violet", // purple
    },
    {
      id: 7,
      name: "Toys & Games",
      icon: <FaGamepad className="text-2xl" />,
      count:
        data?.items.filter((item) => item.category === "Toys & Games").length ||
        0,
      color: "yellow", // yellow
    },
    {
      id: 8,
      name: "Sports & Outdoors",
      icon: <FaRunning className="text-2xl" />,
      count:
        data?.items.filter((item) => item.category === "Sports & Outdoors")
          .length || 0,
      color: "teal", // teal
    },
  ];

  const handleAddToBucket = (product: {
    name: string;
    price: string;
    image: string;
    url: string | null;
    retailer: string;
    calculatedPrice: string;
  }) => {
    addProduct({
      name: product.name,
      price: product.price,
      image: product.image,
      url: product.url || "",
      retailer: product.retailer,
      calculatedPrice: product.calculatedPrice,
    });

    toast.success("Product added to your collection!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white py-16 pt-40">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Taste of Sri Lanka in Melbourne
          </h1>
          <p className="text-xl mb-8">
            Authentic spices, ingredients, and homemade meals delivered to your
            doorstep
          </p>

          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-4 px-6 rounded-full shadow-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-2 bg-amber-500 dark:bg-amber-600 text-white p-2 rounded-full hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors">
              <FiSearch />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Product Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center cursor-pointer border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${categoryColors[category.color]}`}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {category.count} products
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Featured Products
            </h2>
            <a
              href="#"
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              View all
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.items.map((product) => (
              <div
                key={product.id}
                className="product-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                <div className="h-48 bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center relative">
                  {/*   eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-product.jpg";
                    }}
                  />
                  {product.badge && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium capitalize">
                      {product.badge.toLowerCase()}
                    </div>
                  )}
                  {product.retailer && (
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {product.retailer}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2 h-10">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="font-bold text-lg text-amber-600 dark:text-amber-400">
                        {LkrFormat(Number(product.calculatedPrice))}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {product.url && (
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-full transition-colors cursor-pointer"
                          title="View product"
                        >
                          <FiExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        className="bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700 text-white p-2 rounded-full transition-colors cursor-pointer"
                        onClick={() => handleAddToBucket(product)}
                        title="Add to collection"
                      >
                        <FiShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
