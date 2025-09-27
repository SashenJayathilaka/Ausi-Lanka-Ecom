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
    name: "Sachithra Wanasinghe",
    role: "Luxury Boutique Owner (Colombo)",
    image: `https://ui-avatars.com/api/?name=Sachithra+Wanasinghe&background=ff7518&color=fff`,
    text: `Exceptional service! Ausi.lk offers a seamless and trustworthy delivery service directly from Australia, allowing customers to handpick quality products from Australian supermarkets and have them delivered to Sri Lanka with utmost care. 
The team is highly professional, responsive, and committed to ensuring a smooth and reliable experience every time. 
Highly recommended for anyone seeking genuine Australian products delivered hassle-free!`,
    rating: 5,
    order: "#AU-7842",
  },
  {
    id: 2,
    name: "Sayuru Dissanayaka",
    role: "Polonnaruwa",
    image: `https://ui-avatars.com/api/?name=Sayuru+Dissanayaka&background=8b5cf6&color=fff`,
    text: `I recently used Ausi.lk's services to import goods from Australia to Sri Lanka, and I must say their service is excellent! They are highly reliable, professional, and efficient in handling shipments. Their communication is clear, and they provide updates promptly, ensuring a stress-free experience. I would highly recommend them to anyone looking for a trustworthy cargo and freight company. Great job, Ausi.lk!`,
    rating: 5,
    order: "#AU-9215",
  },
  {
    id: 3,
    name: "Chamari Silva",
    role: "Gift Shop Owner (Galle)",
    image:
      "https://ui-avatars.com/api/?name=Chamari+Silva&background=dc2626&color=fff",
    text: "I was amazed by Ausi.LK's customer service when there was a minor customs delay. They handled everything professionally—true peace of mind!",
    rating: 4,
    order: "#AU-6732",
  },
  {
    id: 4,
    name: "Dinesh Rathnayake",
    role: "Cafe Owner (Negombo)",
    image:
      "https://ui-avatars.com/api/?name=Dinesh+Rathnayake&background=ea580c&color=fff",
    text: "Ausi.LK delivers Woolworths and Coles products straight to my café. The Australian coffee beans and snacks keep my customers coming back!",
    rating: 5,
    order: "#AU-4589",
  },
  {
    id: 5,
    name: "Anjali Weerasinghe",
    role: "Electronics Retailer (Colombo)",
    image:
      "https://ui-avatars.com/api/?name=Anjali+Weerasinghe&background=16a34a&color=fff",
    text: "JB Hi-Fi and Officeworks products through Ausi.LK are a game-changer. My store now offers genuine Aussie tech.",
    rating: 5,
    order: "#AU-3367",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="relative py-20 overflow-hidden bg-gradient-to-t from-orange-50/50 via-purple-100/30 to-white dark:from-gray-900 dark:to-purple-900/20 transition-colors duration-500"
    >
      {/* Halloween decorations */}
      <div className="absolute top-10 left-5 text-4xl animate-bounce-slow opacity-80 dark:opacity-100">
        🎃
      </div>
      <div className="absolute top-20 right-8 text-3xl animate-pulse-slow opacity-80 dark:opacity-100">
        👻
      </div>
      <div className="absolute bottom-20 left-10 text-2xl animate-spin-slow opacity-80 dark:opacity-100">
        🕷️
      </div>
      <div className="absolute bottom-10 right-5 text-3xl animate-bounce-medium opacity-80 dark:opacity-100">
        🦇
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-orange-200/30 dark:bg-orange-900/20 blur-3xl opacity-20 transition-colors duration-500"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-3xl opacity-15 transition-colors duration-500"></div>
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
            className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-4 transition-colors duration-500"
          >
            Spooky Customer Stories
          </motion.span>
          <motion.h2
            variants={textVariant(0.3)}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-500"
          >
            Trusted by{" "}
            <span className="text-orange-600 dark:text-orange-400 transition-colors duration-500">
              500+ Businesses
            </span>
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500"
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
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-purple-950/50 overflow-hidden border border-orange-200 dark:border-purple-700 h-full flex flex-col hover:shadow-xl dark:hover:shadow-purple-950/70 transition-all duration-300 group">
                    {/* Halloween corner accent */}
                    <div className="absolute top-3 right-3 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      🎃
                    </div>

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
                          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
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
                      <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3 transition-colors duration-500">
                        {testimonial.text}
                      </p>
                    </div>
                    <div className="px-8 py-4 bg-orange-50 dark:bg-purple-700/50 border-t border-orange-200 dark:border-purple-600 transition-colors duration-500">
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                        Order:{" "}
                        <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-500">
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
              whileHover={{ scale: 1.1, backgroundColor: "#ea580c" }}
              whileTap={{ scale: 0.95 }}
              className="testimonial-prev w-12 h-12 rounded-full border border-orange-200 dark:border-purple-600 flex items-center justify-center bg-white dark:bg-gray-700 hover:bg-orange-500 dark:hover:bg-orange-600 hover:text-white cursor-pointer transition-all shadow-sm"
            >
              <BsChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-white transition-colors duration-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#ea580c" }}
              whileTap={{ scale: 0.95 }}
              className="testimonial-next w-12 h-12 rounded-full border border-orange-200 dark:border-purple-600 flex items-center justify-center bg-white dark:bg-gray-700 hover:bg-orange-500 dark:hover:bg-orange-600 hover:text-white cursor-pointer transition-all shadow-sm"
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
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-500">
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
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                Average Rating
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-500">
              98%
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-500">
                Delivery Success
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                On-time shipments
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-500">
              500+
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-500">
                Happy Clients
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                Across Sri Lanka
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes bounce-medium {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
        .animate-bounce-medium {
          animation: bounce-medium 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .line-clamp-5 {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
