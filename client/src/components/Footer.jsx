import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Instagram, Linkedin, Github, Globe, ArrowUpRight, Cpu, Target } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <footer className="relative bg-[#050505] pt-32 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Brand Accent with Pulse Animation */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F2B82E]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-8 relative z-10"
      >
        
        {/* 1. Large Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          <motion.div variants={itemVariants}>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8">
              STAY <br /> <span className="text-[#F2B82E]">CONNECTED.</span>
            </h2>
            <p className="text-gray-500 text-xl font-light max-w-md leading-relaxed">
              The future of resource sharing isn't corporate—it's communal. Join the decentralized campus movement.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            {/* Columns with Staggered Fade */}
            {[
              { title: "Platform", links: ["Marketplace", "Lend Gear", "Security"] },
              { title: "Legal", links: ["Privacy", "Terms", "Protocol"] }
            ].map((col, i) => (
              <motion.div key={i} variants={itemVariants} className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{col.title}</span>
                <ul className="space-y-4 text-sm font-bold text-gray-400">
                  {col.links.map(link => (
                    <li key={link} className="hover:text-white transition-colors cursor-pointer w-fit">{link}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
            
            <motion.div variants={itemVariants} className="col-span-2 md:col-span-1 space-y-6">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F2B82E]">Build with us</span>
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-white text-xs font-bold hover:bg-white/10 transition-all group"
               >
                 Open Source <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
               </motion.button>
            </motion.div>
          </div>
        </div>

        {/* 2. Social & Identity Line */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center py-12 border-y border-white/5 gap-8"
        >
          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="p-3 bg-white text-black rounded-xl"
            >
               <Cpu size={24} strokeWidth={2.5} />
            </motion.div>
            <div>
              <p className="text-white font-black tracking-tighter text-xl uppercase">CampusLink</p>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">The Sharing Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {[
              { Icon: Linkedin, link: 'https://www.linkedin.com/in/aditya-rawat-6a003532b/'},
              { Icon: Github, link: 'https://github.com/AdityaRawat00189' },
              { Icon: Instagram, link: 'https://www.instagram.com/adityarawat0101/' },
              { Icon: Globe, link: 'https://github.com/AdityaRawat00189' }
            ].map(({ Icon, link }, idx) => (
              <motion.a 
                key={idx} 
                href={link} 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, borderColor: "#F2B82E", color: "#F2B82E" }}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* 3. The Signature */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center mt-12 gap-6"
        >
          <div className="flex items-center gap-3 order-2 md:order-1">
            <span className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">© {currentYear} by</span>
            <span className="text-white font-black text-xs uppercase tracking-tighter hover:text-[#F2B82E] transition-colors cursor-pointer">
              ADITYA RAWAT
            </span>
          </div>
          
          <div className="flex items-center gap-4 order-1 md:order-2">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Systems Operational</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;