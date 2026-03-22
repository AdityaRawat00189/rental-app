import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BrandSlider = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + images.length) % images.length);  // Round the index within bounds of the images array
  };

  return (
    <div className="relative h-125 w-full bg-[#050505] rounded-[3rem] overflow-hidden border border-white/5">
      
      {/* Image Container */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          src={images[index]}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
          }}
          className="absolute inset-0 w-full h-full object-cover  transition-all duration-500"
        />
      </AnimatePresence>

      {/* Navigation Overlays */}
      <div className="absolute inset-0 flex items-center justify-between px-8 z-10 pointer-events-none">
        <button 
          onClick={() => paginate(-1)}
          className="p-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl text-white pointer-events-auto hover:bg-[#F2B82E] hover:text-black transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => paginate(1)}
          className="p-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl text-white pointer-events-auto hover:bg-[#F2B82E] hover:text-black transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {images.map((_, i) => (
          <div 
            key={i}
            className={`h-1 transition-all duration-75 rounded-full ${
              i === index ? 'w-12 bg-[#F2B82E]' : 'w-4 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};


export default BrandSlider;