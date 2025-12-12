// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";

const Layout = ({ children }) => {
  return (
    <div className="bg-[#16161C] text-white min-h-screen flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT WITH TOP PADDING TO ACCOUNT FOR FIXED NAVBAR */}
      <motion.main
        className="flex-grow pt-28 md:pt-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Layout;

