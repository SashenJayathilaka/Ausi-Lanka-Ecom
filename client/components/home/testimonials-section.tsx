/* eslint-disable @next/next/no-img-element */
"use client";

import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight, BsStarFill } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Boutique Owner",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    text: "The Australian product sourcing has transformed my business. My customers love the authentic items and the shipping is always reliable.",
    rating: 5,
    order: "#AU-7842",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Health Store Manager",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "I've been importing vitamins for a year now and couldn't be happier. The platform makes international trade so simple.",
    rating: 5,
    order: "#AU-9215",
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Gift Shop Owner",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    text: "What impressed me most was how quickly they resolved a customs issue. Truly professional service that cares about customers.",
    rating: 4,
    order: "#AU-6732",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Cafe Owner",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "Best Australian coffee beans delivered to my door in Colombo within a week. My customers can't get enough!",
    rating: 5,
    order: "#AU-4589",
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Beauty Retailer",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "The quality assurance checks give me confidence in every order. My clients trust the authenticity of the products.",
    rating: 5,
    order: "#AU-3367",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-100 blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-indigo-100 blur-3xl opacity-15"></div>
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
            className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            Customer Stories
          </motion.span>
          <motion.h2
            variants={textVariant(0.3)}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Trusted by <span className="text-blue-600">500+ Businesses</span>
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
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
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col hover:shadow-xl transition-all duration-300">
                    <div className="p-8 flex-1">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-semibold text-lg">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-500">
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
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-6">{testimonial.text}</p>
                    </div>
                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Order:{" "}
                        <span className="font-medium text-gray-700">
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
              className="testimonial-prev w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white hover:bg-blue-500 hover:text-white cursor-pointer transition-all shadow-sm"
            >
              <BsChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
              whileTap={{ scale: 0.95 }}
              className="testimonial-next w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white hover:bg-blue-500 hover:text-white cursor-pointer transition-all shadow-sm"
            >
              <BsChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={fadeIn("up", 0.7)}
          className="flex flex-wrap justify-center gap-8 mt-16"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-blue-600">4.9</div>
            <div className="flex flex-col">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <BsStarFill key={i} className="w-4 h-4 text-amber-400" />
                ))}
              </div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-blue-600">98%</div>
            <div className="flex flex-col">
              <div className="text-sm font-medium">Delivery Success</div>
              <div className="text-sm text-gray-500">On-time shipments</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="flex flex-col">
              <div className="text-sm font-medium">Happy Clients</div>
              <div className="text-sm text-gray-500">Across Sri Lanka</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
