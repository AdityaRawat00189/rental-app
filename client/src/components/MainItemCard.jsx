import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, ArrowUpRight, Box } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const Navigate = useNavigate();

  const handleDetailsClick = () => {
    // console.log("Navigating to details for item ID:", item._id);
    Navigate(`/ProductDetail/${item._id}`);
  }

  // Mouse tracking for the glow effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  // console.log(item.description);

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="glow-card bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden group flex flex-col h-full transition-all duration-500 hover:border-[#F2B82E]/30"
    >
      {/* 1. Cinematic Media Section */}
      <div className="relative h-60 overflow-hidden bg-white/5">
        <img 
          src={item.images[0] || 'https://via.placeholder.com/400'} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000  group-hover:grayscale-0" 
        />
        
        {/* Category Overlay */}
        <div className="absolute top-4 left-4">
          <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg">
            {item.category}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Available' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-[8px] text-white/70 font-black uppercase tracking-widest">{item.status}</span>
        </div>
      </div>

      {/* 2. Industrial Metadata Section */}
      <div className="p-8 flex flex-col grow relative z-10">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 group-hover:text-[#F2B82E] transition-colors line-clamp-1">
          {item.title}
        </h3>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <User size={14} className='text-[#F2B82E]' />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/20 font-black uppercase tracking-widest leading-none mb-1">Provider</span>
              <span className="text-xs text-white/70 font-bold">{item.owner?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <MapPin size={14} className='text-[#F2B82E]' />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/20 font-black uppercase tracking-widest leading-none mb-1">Deployment</span>
              <span className="text-xs text-white/70 font-bold">{item.owner?.hostel} <span className="text-white/20 ml-1">//</span> {item.owner?.roomNumber}</span>
            </div>
          </div>
        </div>
        
        {/* 3. Action Bar */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-1">Daily Exchange</span>
            <span className="text-2xl font-black text-white tracking-tighter">₹{item.pricePerDay}</span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDetailsClick}
            className="w-12 h-12 bg-[#F2B82E] rounded-2xl flex items-center justify-center text-black shadow-[0_10px_20px_rgba(242,184,46,0.2)]"
          >
            <ArrowUpRight size={20} strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;