import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react';
import image from "../images/image.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden">
      
      {/* Cinematic Background with Slow Zoom Animation */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-screen"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col items-center">
        
        {/* Animated Badge */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/5 border border-white/10 px-4 py-1 rounded-full mb-8"
        >
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">The New Protocol</span>
        </motion.div>

        {/* Masked Text Animation (The 'Stagger' effect) */}
        <div className="overflow-hidden mb-4">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Custom cubic-bezier for 'Apple' feel
            className="text-7xl md:text-[140px] font-black text-white leading-[0.85] tracking-tighter"
          >
            OWN LESS.
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-[0.85] tracking-tighter"
          >
            DO MORE.
          </motion.h1>
        </div>

        {/* Fade in Subtext */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mt-12 max-w-xl text-center text-gray-500 text-xl font-light"
        >
          A hyper-local peer-to-peer exchange platform designed for the next generation.
        </motion.p>

        {/* Magnetic Button Animation */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 px-12 py-5 bg-[#F2B82E] text-black font-black rounded-full flex items-center gap-3 shadow-[0_20px_40px_rgba(242,184,46,0.2)]"
        >
          Explore Assets <ArrowRight size={20} />
        </motion.button>

      </div>
    </section>
  );
};

export default Hero;