"use client"
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className = "",
  containerClassName = "",
  animate = true,
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={`relative p-[4px] group ${containerClassName}`}>
      <motion.div
        variants={variants}
        initial="initial"
        animate={animate ? "animate" : "initial"}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundSize: "400% 400%",
        }}
        className={`absolute inset-0 rounded-3xl opacity-60 group-hover:opacity-100 blur-xl transition duration-500 ${className}`}
      />
      <motion.div
        variants={variants}
        initial="initial"
        animate={animate ? "animate" : "initial"}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundSize: "400% 400%",
        }}
        className={`absolute inset-0 rounded-3xl ${className}`}
      />

      <div className="relative">{children}</div>
    </div>
  );
};