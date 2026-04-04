import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, Fingerprint, Globe2 } from 'lucide-react';

const AboutUs = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section id="about" className="py-40 bg-[#000000] text-white relative overflow-hidden">
      
      {/* 1. Parallax Background Text */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.04 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-20 left-10 text-[25vw] font-black leading-none select-none pointer-events-none uppercase"
      >
        Access
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        
        {/* 2. Top Header: The Vision */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-40">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#F2B82E]"></div>
              <span className="text-[#F2B82E] text-xs font-black uppercase tracking-[0.4em]">The New Standard</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10 uppercase">
              WE ARE THE <br />
              <span className="italic font-light text-white/40">COMMUNITY</span> <br />
              ENGINE.
            </motion.h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="md:pt-20"
          >
            <p className="text-gray-500 text-xl md:text-2xl font-light max-w-sm leading-relaxed border-l border-white/10 pl-8">
              Moving away from ownership. Moving toward a fluid, hyper-local economy.
            </p>
          </motion.div>
        </div>

        {/* 3. The Creative Grid: Non-Standard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Large Image Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="md:col-span-7 relative group overflow-hidden rounded-sm cursor-none"
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop" 
              alt="Community" 
              className="w-full h-125 object-cover filter grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
            />
            <div className="absolute bottom-8 left-8">
               <p className="text-white font-black text-4xl tracking-tighter uppercase">01/SECURE</p>
            </div>
          </motion.div>

          {/* Value Propositions */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-5 flex flex-col justify-between gap-8"
          >
            <motion.div 
              variants={fadeInUp}
              whileHover={{ borderColor: "rgba(242, 184, 46, 0.4)" }}
              className="p-10 bg-white/[0.03] border border-white/5 transition-colors group cursor-default"
            >
              <Fingerprint className="text-[#F2B82E] mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-2xl font-bold mb-4 italic uppercase">The Identity Protocol</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Peer-to-peer trust is hardcoded. Every user is verified through a closed-loop institutional system.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="p-10 bg-[#F2B82E] text-black group cursor-pointer"
            >
              <Globe2 className="mb-6 group-hover:rotate-12 transition-transform" size={32} />
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Zero Waste</h3>
              <p className="text-black/70 font-medium leading-relaxed">
                Why buy what you can borrow? We are cutting campus carbon footprints by 40% through circularity.
              </p>
              <div className="mt-8 flex justify-end">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowUpRight size={40} strokeWidth={1} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 4. The Bottom Bar: Human Element */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-40 flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-12"
        >
          <div className="space-y-4">
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-black">Lead Architect</p>
            <h4 className="text-3xl font-black tracking-tighter uppercase hover:text-[#F2B82E] transition-colors cursor-default">
              Aditya Rawat
            </h4>
          </div>
          
          <div className="text-right hidden md:block">
            <p className="text-white/20 text-sm font-mono tracking-widest uppercase">
              v1.0 // RE-DEFINING THE CAMPUS EXPERIENCE
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutUs;