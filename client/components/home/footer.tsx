"use client";

import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { motion } from "framer-motion";
import {
  FaCcApplePay,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { RiCustomerService2Fill } from "react-icons/ri";

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: "All Products", href: "/products" },
      { name: "New Arrivals", href: "/new-arrivals" },
      { name: "Best Sellers", href: "/best-sellers" },
      { name: "Special Offers", href: "/offers" },
      { name: "Gift Cards", href: "/gift-cards" },
    ],
    customer: [
      { name: "My Account", href: "/account" },
      { name: "Order Tracking", href: "/track-order" },
      { name: "Wishlist", href: "/wishlist" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns & Exchanges", href: "/returns" },
    ],
    about: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Careers", href: "/careers" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
    contact: [
      { name: "Contact Us", href: "/contact" },
      { name: "Help Center", href: "/help" },
      { name: "Live Chat", href: "/chat" },
      { name: "FAQs", href: "/faqs" },
      { name: "Feedback", href: "/feedback" },
    ],
  };

  const paymentMethods = [
    { icon: <FaCcVisa className="w-8 h-8" />, name: "Visa" },
    { icon: <FaCcMastercard className="w-8 h-8" />, name: "Mastercard" },
    { icon: <FaCcPaypal className="w-8 h-8" />, name: "PayPal" },
    { icon: <FaCcApplePay className="w-8 h-8" />, name: "Apple Pay" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div variants={fadeIn("right", 0.3)} className="lg:col-span-1">
            <motion.div
              variants={textVariant(0.2)}
              className="flex items-center gap-2 mb-6"
            >
              <span className="text-2xl font-bold text-white">
                Shop<span className="text-blue-400">Hub</span>
              </span>
            </motion.div>
            <motion.p variants={fadeIn("up", 0.4)} className="mb-6">
              Your trusted partner for international shopping and seamless
              delivery to your doorstep.
            </motion.p>

            <motion.div
              variants={fadeIn("up", 0.5)}
              className="flex gap-4 mb-8"
            >
              {[
                { icon: <FaFacebookF />, color: "bg-blue-600" },
                { icon: <FaTwitter />, color: "bg-blue-400" },
                { icon: <FaInstagram />, color: "bg-pink-600" },
                { icon: <FaPinterestP />, color: "bg-red-600" },
                { icon: <FaYoutube />, color: "bg-red-700" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  variants={fadeIn("right", index * 0.1)}
                  whileHover={{ y: -5 }}
                  href="#"
                  className={`${social.color} w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-all`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>

            <motion.div variants={fadeIn("up", 0.6)} className="space-y-3">
              <div className="flex items-center gap-3">
                <FiPhone className="text-blue-400" />
                <span>+94 76 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-blue-400" />
                <span>support@shophub.lk</span>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-blue-400 mt-1" />
                <span>123 Commercial St, Colombo 01, Sri Lanka</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(
            ([category, links], categoryIndex) => (
              <motion.div
                key={category}
                variants={fadeIn("up", 0.3 * (categoryIndex + 1))}
              >
                <motion.h3
                  variants={textVariant(0.2)}
                  className="text-lg font-semibold text-white mb-6 uppercase tracking-wider"
                >
                  {category}
                </motion.h3>
                <motion.ul variants={fadeIn("up", 0.4)} className="space-y-3">
                  {links.map((link, index) => (
                    <motion.li
                      key={index}
                      variants={fadeIn("up", 0.1 * index)}
                      whileHover={{ x: 5 }}
                    >
                      <a
                        href={link.href}
                        className="hover:text-blue-400 transition-colors"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )
          )}
        </div>

        {/* Customer Support Banner */}
        <motion.div
          variants={fadeIn("up", 0.7)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <RiCustomerService2Fill className="w-12 h-12 text-white" />
            <div>
              <h4 className="text-xl font-bold text-white">Need Help?</h4>
              <p className="text-blue-100">
                Our customer support is available 24/7
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Contact Support
          </motion.button>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          variants={fadeIn("up", 0.8)}
          className="flex flex-wrap items-center justify-center gap-6 mb-8"
        >
          {paymentMethods.map((method, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", index * 0.1)}
              whileHover={{ y: -5 }}
              className="bg-gray-800 p-3 rounded-lg"
              title={method.name}
            >
              {method.icon}
            </motion.div>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={fadeIn("up", 0.9)}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ShopHub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm">
                Sitemap
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
