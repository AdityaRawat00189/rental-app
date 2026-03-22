import React from 'react';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed
import { Search, MessageSquare, RefreshCw, ChevronRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search strokeWidth={1.5} size={40} />,
      title: "DISCOVER",
      description: "Browse a curated collection of high-value assets within your immediate circle. No waste, just access.",
    },
    {
      icon: <MessageSquare strokeWidth={1.5} size={40} />,
      title: "NEGOTIATE",
      description: "Direct end-to-end communication. Finalize terms and logistics through our secure, encrypted protocol.",
    },
    {
      icon: <RefreshCw strokeWidth={1.5} size={40} />,
      title: "CIRCULATE",
      description: "Complete the exchange. Join the circular economy by giving items a second, third, and fourth life.",
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section id='how-it-works' className='py-40 bg-[#050505] relative overflow-hidden'>
      {/* Structural Background Detail */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        
        {/* Brand Header with Slide-up Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-[-0.05em] leading-[0.9]">
              THE <span className="text-[#F2B82E]">PROTOCOL.</span>
            </h2>
            <p className="text-gray-500 text-xl md:text-2xl font-light leading-relaxed">
              We’ve simplified the exchange of value. 
              Efficiency is the only metric that matters.
            </p>
          </div>
          <div className="hidden md:block">
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: 64 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="w-[1px] bg-[#F2B82E] mb-4 mx-auto"
            />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.5em] font-bold [writing-mode:vertical-lr]">System Flow</span>
          </div>
        </motion.div>
      
        {/* Steps Grid with Staggered Children */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 rounded-[2rem] overflow-hidden bg-white/[0.02] backdrop-blur-3xl"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className={`relative p-12 lg:p-16 group transition-all duration-700 hover:bg-white/[0.03] ${
                index !== 2 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''
              }`}
            >
              {/* Animated Index Number */}
              <span className="absolute top-8 right-8 text-white/10 font-black text-6xl italic group-hover:text-[#F2B82E]/10 transition-all duration-500 group-hover:-translate-y-2">
                0{index + 1}
              </span>
              
              <div className="relative z-10">
                {/* Icon with hover rotation */}
                <motion.div 
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  className="text-[#F2B82E] mb-12 inline-block transition-colors duration-500"
                >
                  {step.icon}
                </motion.div>

                <h3 className="text-2xl font-black text-white mb-6 tracking-tighter uppercase">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed font-light group-hover:text-gray-200 transition-colors">
                  {step.description}
                </p>

                {/* Animated CTA link */}
                <div className="mt-10 flex items-center gap-2 text-[#F2B82E] text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 cursor-pointer">
                  Learn the logic <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Liquid Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F2B82E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 text-center"
        >
          <p className="text-white/20 text-sm font-bold uppercase tracking-[0.4em] mb-4">Ready to optimize?</p>
          <div className="inline-block h-[1px] w-20 bg-white/10"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;