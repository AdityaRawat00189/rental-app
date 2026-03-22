import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShoppingBag, Zap, Shield, Globe } from 'lucide-react';

const FeaturedItems = () => {
  const items = [
    {
      id: 1,
      tag: "Electronics",
      title: "Pro-Grade Peripherals",
      price: "$12/day",
      img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
      span: "md:col-span-8",
    },
    {
      id: 2,
      tag: "Academic",
      title: "Design Kits",
      price: "$5/day",
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
      span: "md:col-span-4",
    },
    {
      id: 3,
      tag: "Photography",
      title: "Optics & Lens",
      price: "$25/day",
      img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
      span: "md:col-span-4",
    },
    {
      id: 4,
      tag: "Lifestyle",
      title: "Adventure Gear",
      price: "$18/day",
      img: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=800&auto=format&fit=crop",
      span: "md:col-span-8",
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="py-40 bg-[#050505] text-white relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F2B82E]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#F2B82E] animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F2B82E]">Available Now</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
              The <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white/20">Archive.</span>
            </h2>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pb-4">
            <button className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] border-b border-white/10 pb-2 hover:border-[#F2B82E] transition-all">
              All Assets <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* Bento Grid with Staggered Entrance */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          {items.map((item) => (
            <motion.div 
              key={item.id} 
              variants={itemVariants}
              className={`relative overflow-hidden group rounded-[2rem] bg-[#0a0a0a] border border-white/5 ${item.span} h-[500px] cursor-none`}
            >
              {/* Image with sophisticated zoom */}
              <motion.img 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-all duration-700 grayscale group-hover:grayscale-0"
              />

              {/* Masked Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />

              {/* Item Metadata Overlay */}
              <div className="absolute inset-0 p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  >
                    {item.tag}
                  </motion.span>
                  
                  {/* Magnetic-style button container */}
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    className="w-14 h-14 rounded-2xl bg-[#F2B82E] flex items-center justify-center text-black shadow-[0_0_30px_rgba(242,184,46,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer"
                  >
                    <ShoppingBag size={20} strokeWidth={3} />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">{item.title}</h3>
                  <div className="flex items-center gap-6">
                    <span className="text-[#F2B82E] font-mono text-xl">{item.price}</span>
                    <div className="h-[1px] w-12 bg-white/10"></div>
                    <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Verified Asset</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Status Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 py-16 border-t border-white/5"
        >
          {[
            { icon: <Shield size={22}/>, label: "Vault Security", detail: "End-to-end encryption active" },
            { icon: <Zap size={22}/>, label: "Neural Sync", detail: "Real-time availability tracking" },
            { icon: <Globe size={22}/>, label: "Global Reach", detail: "Peer-to-peer decentralized grid" }
          ].map((trait, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="flex items-start gap-6 group"
            >
              <div className="text-[#F2B82E] p-3 bg-white/5 rounded-2xl group-hover:bg-[#F2B82E] group-hover:text-black transition-all duration-500">
                {trait.icon}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white mb-2">{trait.label}</p>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] leading-relaxed">{trait.detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedItems;