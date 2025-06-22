import { Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";
type AnimationType = "spring" | "tween" | "inertia" | "keyframes";

export const fadeIn = (
  direction: Direction,
  delay: number,
  type: AnimationType = "spring",
  duration: number = 1.25
): Variants => ({
  hidden: {
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    opacity: 0,
  },
  show: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: type === "spring" ? undefined : "easeOut",
    },
  },
});

export const staggerContainer = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const slideIn = (
  direction: Direction,
  type: AnimationType = "spring",
  delay: number = 0,
  duration: number = 0.75
): Variants => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: type === "spring" ? undefined : "easeOut",
    },
  },
});

export const textVariant = (delay: number = 0): Variants => ({
  hidden: {
    y: 50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25,
      delay,
    },
  },
});

export const scale = (
  delay: number = 0,
  type: AnimationType = "spring"
): Variants => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type,
      delay,
      duration: 1.25,
    },
  },
});

export const bounce = (delay: number = 0): Variants => ({
  hidden: {
    y: -20,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
      delay,
    },
  },
});

export const flip = (delay: number = 0): Variants => ({
  hidden: {
    rotateX: 90,
    opacity: 0,
  },
  show: {
    rotateX: 0,
    opacity: 1,
    transition: {
      type: "spring",
      delay,
      duration: 0.75,
    },
  },
});

export const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export const listItem = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};
