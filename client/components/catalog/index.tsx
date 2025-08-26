"use client";

import { useState } from "react";
import {
  FaBreadSlice,
  FaCookie,
  FaPepperHot,
  FaWineBottle,
} from "react-icons/fa";
import { FiSearch, FiShoppingCart } from "react-icons/fi";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const AusiLkCatalog = () => {
  const [cartCount, setCartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: 1,
      name: "Spices & Masalas",
      icon: <FaPepperHot className="text-2xl" />,
      count: 42,
    },
    {
      id: 2,
      name: "Ready-to-Eat Meals",
      icon: <FaBreadSlice className="text-2xl" />,
      count: 28,
    },
    {
      id: 3,
      name: "Beverages",
      icon: <FaWineBottle className="text-2xl" />,
      count: 35,
    },
    {
      id: 4,
      name: "Snacks & Sweets",
      icon: <FaCookie className="text-2xl" />,
      count: 57,
    },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "Sri Lankan Curry Powder",
      description: "Authentic roasted curry powder",
      price: 8.99,
      category: "Spices & Masalas",
      image: "/images/curry-powder.jpg",
    },
    {
      id: 2,
      name: "Kottu Roti Kit",
      description: "Everything you need for homemade kottu",
      price: 18.5,
      category: "Ready-to-Eat Meals",
      image: "/images/kottu-kit.jpg",
    },
    {
      id: 3,
      name: "Woodapple Juice",
      description: "Traditional Sri Lankan woodapple beverage",
      price: 5.99,
      category: "Beverages",
      image: "/images/woodapple-juice.jpg",
    },
    {
      id: 4,
      name: "Kokis",
      description: "Traditional crispy snack",
      price: 7.5,
      category: "Snacks & Sweets",
      image: "/images/kokis.jpg",
    },
  ];

  const addToCart = (productId: number) => {
    console.log("🚀 ~ addToCart ~ productId:", productId);
    setCartCount(cartCount + 1);
    // Add your cart logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white py-16 pt-56">
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
      <section className="py-12 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Product Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center cursor-pointer border border-gray-100 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-500 transition-all"
              >
                <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
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
      <section className="py-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
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
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="h-48 bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <div className="w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <FiShoppingCart className="text-4xl" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-lg text-amber-600 dark:text-amber-400">
                      A${product.price.toFixed(2)}
                    </span>
                    <button
                      className="bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700 text-white p-2 rounded-full transition-colors"
                      onClick={() => addToCart(product.id)}
                    >
                      <FiShoppingCart />
                    </button>
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

export default AusiLkCatalog;
