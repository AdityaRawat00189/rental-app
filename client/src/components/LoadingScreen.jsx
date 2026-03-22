import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#050505] z-[999] flex flex-col items-center justify-center overflow-hidden">
      
      {/* 1. Background Grid Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="relative flex flex-col items-center">
        
        {/* 2. The Animated Core */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-12">
          
          {/* Rotating Outer Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full"
          />

          {/* Pulsing Middle Ring */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-20 h-20 bg-[#F2B82E] rounded-full blur-2xl"
          />

          {/* Central Hardware Icon */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 bg-[#050505] p-4 rounded-2xl border border-white/10 shadow-2xl"
          >
            <Cpu className="text-[#F2B82E]" size={32} strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* 3. The Command Text Logic */}
        <div className="text-center space-y-3">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-white font-black text-xs uppercase tracking-[0.5em]"
          >
            Initializing Protocol
          </motion.h2>
          
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/20 text-[10px] font-mono tracking-widest uppercase">
              Verifying Network
            </span>
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-1 h-3 bg-[#F2B82E]"
            />
          </div>
        </div>

        {/* 4. Progress Percentage (Optional Visual) */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-40">
           <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#F2B82E]"
              />
           </div>
        </div>
      </div>

      {/* Security Status Footer */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.4em] text-white/10">
        <span className="flex h-1 w-1 rounded-full bg-green-500/50"></span>
        Vault Encryption Active
      </div>
    </div>
  );
};

export default LoadingScreen;