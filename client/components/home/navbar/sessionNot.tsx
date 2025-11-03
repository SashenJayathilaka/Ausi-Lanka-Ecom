"use client";

import { useCartStore } from "@/store/useCartStore";
import { fadeIn, staggerContainer } from "@/utils/motion";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { HiMenu, HiSearch, HiShoppingCart, HiX } from "react-icons/hi";
import { AuthButton } from "../auth-button";

const SessionNot = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const cartItems = useCartStore((state) => state.products);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Shop" },
    { href: "/catalog", label: "Catalog" },
    { href: "/items", label: "In Stock Items" },
  ];

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setScrolled(window.scrollY > 10);
      }
    };

    if (typeof window !== "undefined") {
      setActiveLink(window.location.pathname);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md h-16"></div>
    );
  }

  return (
    <motion.nav
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-2 border-b border-gray-100 dark:border-gray-800"
          : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm py-3"
      }`}
    >
      <div className="w-full flex justify-between items-center container mx-auto px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <motion.div
          variants={fadeIn("right", 0.3)}
          className="flex items-center gap-2"
        >
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-0"
            >
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Ausi.
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Lk
              </span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Search Bar - Desktop */}
        <motion.div
          variants={fadeIn("down", 0.3)}
          className="hidden md:flex flex-1 max-w-md mx-8"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 dark:bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
              <HiSearch className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Navigation Links - Desktop */}
        <motion.div
          variants={fadeIn("down", 0.3)}
          className="hidden lg:flex items-center gap-8"
        >
          {navLinks.map((link, index) => (
            <motion.div
              key={index}
              variants={fadeIn("down", 0.1 * (index + 1))}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300 ${
                  activeLink === link.href
                    ? "text-blue-600 dark:text-blue-400 after:w-full"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Side Items */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.button
            variants={fadeIn("left", 0.3)}
            whileHover={{ scale: 1.05 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </motion.button>

          {/* Search Icon - Mobile */}
          <motion.button
            variants={fadeIn("left", 0.3)}
            whileHover={{ scale: 1.05 }}
            className="md:hidden p-2"
          >
            <HiSearch className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </motion.button>

          {/* Wishlist */}
          {/*           <motion.div
            variants={fadeIn("left", 0.3)}
            whileHover={{ scale: 1.05 }}
            className="relative hidden md:block"
          >
            <Link href="/wishlist" className="p-2 flex items-center">
              <FiHeart className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors" />
              <span className="sr-only">Wishlist</span>
            </Link>
          </motion.div> */}

          {/* Cart Icon with Count */}
          <motion.div
            variants={fadeIn("left", 0.3)}
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Link href="/cart" className="p-2 flex items-center">
              <HiShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
              {cartItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartItems.length > 9 ? "9+" : cartItems.length}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* User Auth */}
          <motion.div variants={fadeIn("left", 0.3)}>
            <AuthButton data={{ userType: "guest" }} />
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            variants={fadeIn("left", 0.3)}
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <HiX className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <HiMenu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          animate="show"
          className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-lg"
        >
          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            className="container mx-auto px-4 py-4 space-y-4"
          >
            {/* Mobile Search */}
            <motion.div variants={fadeIn("down", 0.2)}>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 dark:bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  <HiSearch className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                variants={fadeIn("right", 0.1 * (index + 1))}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  href={link.href}
                  onClick={() => {
                    setActiveLink(link.href);
                    setIsMenuOpen(false);
                  }}
                  className={`block text-sm font-medium py-2 px-2 rounded-lg ${
                    activeLink === link.href
                      ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/*             <motion.div
              variants={fadeIn("up", 0.4)}
              className="pt-2 border-t border-gray-100 dark:border-gray-700"
            >
              <Link
                href="/wishlist"
                className="flex items-center gap-2 text-sm font-medium py-2 px-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FiHeart className="h-5 w-5" />
                <span>Wishlist</span>
              </Link>
            </motion.div> */}
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default SessionNot;
