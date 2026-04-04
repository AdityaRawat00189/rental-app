import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Trash2, ArrowRight, Shield } from "lucide-react";

const RequestCard = ({ data }) => {
  // Protocol Status Logic
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { color: '#F2B82E', icon: <Clock size={14} />, label: 'Awaiting Auth' };
      case 'approved':
        return { color: '#22C55E', icon: <CheckCircle2 size={14} />, label: 'Protocol Active' };
      case 'rejected':
        return { color: '#EF4444', icon: <XCircle size={14} />, label: 'Access Denied' };
      default:
        return { color: '#6B7280', icon: <Clock size={14} />, label: 'Unknown' };
    }
  };

  const config = getStatusConfig(data.status);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
      className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-500 group mb-4"
    >
      {/* 1. Asset Identity Section */}
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#F2B82E] border border-white/10 group-hover:bg-[#F2B82E] group-hover:text-black transition-all duration-500 shadow-xl">
          <Shield size={22} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Asset_Log</span>
          <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
            {data.itemName || "Unnamed Asset"}
          </h4>
        </div>
      </div>

      {/* 2. System Status & Metadata */}
      <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5">
            <div 
              className="w-1.5 h-1.5 rounded-full animate-pulse" 
              style={{ backgroundColor: config.color, boxShadow: `0 0 12px ${config.color}` }} 
            />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">
              {config.label}
            </span>
          </div>
          <span className="text-[8px] font-mono text-gray-700 uppercase tracking-[0.2em]">
            ID: {data._id?.slice(-8).toUpperCase() || "INTERNAL"}
          </span>
        </div>

        {/* 3. Action Protocol */}
        <div className="flex items-center min-w-[120px] justify-end">
          {data.status === 'pending' ? (
            <motion.button 
              whileHover={{ scale: 1.05, color: "#EF4444" }}
              whileTap={{ scale: 0.95 }}
              className="group/btn flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all py-2.5 px-5 border border-white/5 rounded-xl hover:border-red-500/30 hover:bg-red-500/5"
            >
              Terminate <Trash2 size={14} className="group-hover/btn:rotate-12 transition-transform" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-3 text-white/20">
               <span className="text-[9px] font-black uppercase tracking-widest">Locked</span>
               <div className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center">
                 {config.icon}
               </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RequestCard;