import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import Category from '../components/category';
import ItemCard from '../components/MainItemCard';
import { Loader2, Sparkles, Box, ArrowRight } from 'lucide-react';
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
        const response = await axios.get('https://rental-app-1-zfws.onrender.com/api/item/', {
          headers: { Authorization: `Bearer ${token}` },
          category : 'All',
        });
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
            <button onClick={() => Navigate('/lend')} className="text-[#F2B82E] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
              Lend Your Gear <ArrowRight size={14} />
            </button>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase">
              Current <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2B82E] to-white/20">Assets.</span>
            </h2>
          </div>
          
          <div className="hidden lg:block text-right">
             <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Network Status</p>
             <div className="flex items-center gap-2 justify-end">
                <span className="text-white font-mono text-sm">Operational</span>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
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