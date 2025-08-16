/* eslint-disable @next/next/no-img-element */
"use client";

import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight, BsStarFill } from "react-icons/bs";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    id: 1,
    name: "Nadeesha Perera",
    role: "Luxury Boutique Owner (Colombo)",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    text: "Ausi.LK has transformed my boutique with genuine Australian products. My customers adore the premium quality, and shipping is always fast.",
    rating: 5,
    order: "#AU-7842",
  },
  {
    id: 2,
    name: "Rajiv Fernando",
    role: "Pharmacy Chain Manager (Kandy)",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Thanks to Ausi.LK, I now stock Chemist Warehouse products in Sri Lanka. The vitamins and supplements sell out fast—my customers trust the authenticity!",
    rating: 5,
    order: "#AU-9215",
  },
  {
    id: 3,
    name: "Chamari Silva",
    role: "Gift Shop Owner (Galle)",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    text: "I was amazed by Ausi.LK’s customer service when there was a minor customs delay. They handled everything professionally—true peace of mind!",
    rating: 4,
    order: "#AU-6732",
  },
  {
    id: 4,
    name: "Dinesh Rathnayake",
    role: "Cafe Owner (Negombo)",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "Ausi.LK delivers Woolworths and Coles products straight to my café. The Australian coffee beans and snacks keep my customers coming back!",
    rating: 5,
    order: "#AU-4589",
  },
  {
    id: 5,
    name: "Anjali Weerasinghe",
    role: "Electronics Retailer (Colombo)",
    image: "https://randomuser.me/api/portraits/women/15.jpg",
    text: "JB Hi-Fi and Officeworks products through Ausi.LK are a game-changer. My store now offers genuine Aussie tech.",
    rating: 5,
    order: "#AU-3367",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl opacity-20 transition-colors duration-500"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-3xl opacity-15 transition-colors duration-500"></div>
      </div>

      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Section header */}
        <motion.div variants={fadeIn("up", 0.3)} className="text-center mb-16">
          <motion.span
            variants={fadeIn("up", 0.2)}
            className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4 transition-colors duration-500"
          >
            Customer Stories
          </motion.span>
          <motion.h2
            variants={textVariant(0.3)}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-500"
          >
            Trusted by{" "}
            <span className="text-blue-600 dark:text-blue-400 transition-colors duration-500">
              500+ Businesses
            </span>
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500"
          >
            {` Hear from entrepreneurs who've transformed their businesses with our
            international shipping solutions`}
          </motion.p>
        </motion.div>

        {/* Testimonials slider */}
        <motion.div variants={fadeIn("up", 0.5)} className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            navigation={{
              nextEl: ".testimonial-next",
              prevEl: ".testimonial-prev",
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  variants={fadeIn("up", index * 0.1)}
                  className="h-full"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950/50 overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col hover:shadow-xl dark:hover:shadow-gray-950/70 transition-all duration-300">
                    <div className="p-8 flex-1">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white transition-colors duration-500">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <BsStarFill
                            key={i}
                            className={`w-5 h-5 ${
                              i < testimonial.rating
                                ? "text-amber-400"
                                : "text-gray-300 dark:text-gray-600"
                            } transition-colors duration-500`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-500">
                        {testimonial.text}
                      </p>
                    </div>
                    <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-600 transition-colors duration-500">
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                        Order:{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-200 transition-colors duration-500">
                          {testimonial.order}
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <motion.div
            variants={fadeIn("up", 0.6)}
            className="flex justify-center gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
              whileTap={{ scale: 0.95 }}
              className="testimonial-prev w-12 h-12 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white cursor-pointer transition-all shadow-sm"
            >
              <BsChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-white transition-colors duration-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
              whileTap={{ scale: 0.95 }}
              className="testimonial-next w-12 h-12 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white cursor-pointer transition-all shadow-sm"
            >
              <BsChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-white transition-colors duration-300" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={fadeIn("up", 0.7)}
          className="flex flex-wrap justify-center gap-8 mt-16"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-500">
              4.9
            </div>
            <div className="flex flex-col">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <BsStarFill
                    key={i}
                    className="w-4 h-4 text-amber-400 transition-colors duration-500"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                Average Rating
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-500">
              98%
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-500">
                Delivery Success
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                On-time shipments
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-500">
              500+
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-500">
                Happy Clients
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                Across Sri Lanka
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
