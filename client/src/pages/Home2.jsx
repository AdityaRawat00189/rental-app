import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import Category from '../components/category';
import ItemCard from '../components/MainItemCard';
import { Loader2, Sparkles, Box, ArrowRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const Navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const user = localStorage.getItem('user');
        const token = user ? JSON.parse(user).token : null;

        const BASE_URL = import.meta.env.VITE_BASE_URL;
        console.log('Fetching items with token:', token);
        const response = await axios.get(`${BASE_URL}/api/item`, {
          headers: { Authorization: `Bearer ${token}` },
          category: 'All'
        });
        console.log("Backend response:", response.data);
        setItems(response.data.items);
      } catch (error) {
        console.error("Error fetching items:", error);
        if (error?.response?.status === 401) {
          localStorage.removeItem('user');
          Navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [Navigate]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen selection:bg-[#F2B82E] selection:text-black">
      {/* 1. Category Navigation (Sticky) */}
      <Category />

      <section className="py-32 max-w-7xl mx-auto px-8 relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#F2B82E]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* 2. Header Logic */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 relative z-10"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <Sparkles size={14} className="text-[#F2B82E] animate-pulse" />
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Live Database</span>
            </div>
            <button onClick={() => Navigate('/dashboard')} className="text-[#F2B82E] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
              Dashboard <ArrowRight size={14} />
            </button>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase">
              Current <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2B82E] to-white/20">Assets.</span>
            </h2>
          </div>
          
          <div className="hidden lg:flex flex-col items-end gap-10 text-right">
            {/* Messages Button */}
            <div>
              <button
                onClick={() => Navigate('/messages')}
                className="group inline-flex items-center gap-3 rounded-md border border-white/10 bg-[#121212] px-6 py-3 text-[#F2B82E] text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0px_rgba(242,184,46,0.15)] hover:shadow-[2px_2px_0px_rgba(242,184,46,0.3)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all active:shadow-none active:translate-y-[4px] active:translate-x-[4px]"
              >
                <MessageSquare size={18} strokeWidth={2.5} />
                Messages
              </button>
            </div>

            {/* Network Status */}
            <div className="flex flex-col items-end gap-1.5">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                System
              </p>
              <div className="flex items-center gap-2.5 rounded border border-white/5 bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm">
                <span className="text-gray-300 font-mono text-[11px] uppercase tracking-wider">
                  Operational
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Loading State: System Initialization Look */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 border border-white/5 rounded-[3rem] bg-white/[0.01]"
            >
              <Loader2 className="animate-spin text-[#F2B82E] mb-6" size={40} strokeWidth={1.5} />
              <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Syncing Marketplace Grid...</p>
            </motion.div>
          ) : (
            /* 4. Grid Logic: Staggered Reveal */
            <motion.div 
              key="grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
            >
              {items.length > 0 ? (
                items.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))
              ) : (
                <motion.div 
                  variants={containerVariants}
                  className="col-span-full flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-white/5 rounded-[3rem]"
                >
                  <Box size={48} className="text-white/10 mb-6" strokeWidth={1} />
                  <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No local assets deployed</p>
                  <button onClick={() => Navigate('/lend')} className="mt-8 text-[#F2B82E] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                    Lend First Gear <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </div>
  );
};

export default Home;