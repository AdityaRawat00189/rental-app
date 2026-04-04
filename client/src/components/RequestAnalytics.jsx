import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, ShieldCheck, Zap, Terminal } from 'lucide-react';

const RequestAnalytics = ({ requests = [] }) => {
  // Compute system metrics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    active: requests.filter(r => r.status === 'approved').length,
    terminated: requests.filter(r => r.status === 'rejected').length
  };

  const StatBlock = ({ label, value, icon: Icon, isPrimary }) => (
    <motion.div 
      whileHover={{ y: -8, borderColor: isPrimary ? "#F2B82E" : "rgba(242, 184, 46, 0.4)" }}
      className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
        isPrimary 
        ? 'bg-[#F2B82E] border-[#F2B82E] shadow-[0_20px_50px_rgba(242,184,46,0.15)]' 
        : 'bg-[#0a0a0a] border-white/5'
      }`}
    >
      {/* Background Watermark Icon */}
      <Icon 
        size={140} 
        className={`absolute -bottom-10 -right-10 opacity-[0.05] ${isPrimary ? 'text-black' : 'text-white'}`} 
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-12">
          <div className={`p-4 rounded-2xl ${isPrimary ? 'bg-black/10' : 'bg-white/5 border border-white/10'}`}>
            <Icon size={24} className={isPrimary ? 'text-black' : 'text-[#F2B82E]'} />
          </div>
          <div className="flex flex-col items-end">
             <div className={`w-2 h-2 rounded-full ${isPrimary ? 'bg-black' : 'bg-[#F2B82E] animate-pulse'}`} 
                  style={!isPrimary ? { boxShadow: '0 0 15px #F2B82E' } : {}}></div>
             <span className={`text-[9px] font-black uppercase tracking-[0.5em] mt-2 ${isPrimary ? 'text-black/40' : 'text-white/20'}`}>
               Live_Sync
             </span>
          </div>
        </div>

        <div>
          <h3 className={`text-7xl font-black tracking-tighter leading-none ${isPrimary ? 'text-black' : 'text-white'}`}>
            {String(value).padStart(2, '0')}
          </h3>
          <p className={`text-[11px] font-black uppercase tracking-[0.3em] mt-4 ${isPrimary ? 'text-black/60' : 'text-gray-500'}`}>
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="mb-24">
      {/* System Identification Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
        <div className="flex items-center gap-6">
          <div className="h-14 w-[4px] bg-[#F2B82E] rounded-full shadow-[0_0_15px_#F2B82E]"></div>
          <div>
            <h2 className="text-white font-black text-4xl tracking-tighter uppercase leading-none">Intelligence</h2>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.6em] mt-3">Central Matrix // Terminal_v1.0.4</p>
          </div>
        </div>
        
        <div className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center gap-4 backdrop-blur-md">
          <Terminal size={14} className="text-[#F2B82E]" />
          <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.4em]">Protocol: Encrypted</span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatBlock 
          label="Total Logs" 
          value={stats.total} 
          icon={Activity} 
          isPrimary={true} 
        />
        <StatBlock 
          label="Pending Auth" 
          value={stats.pending} 
          icon={Clock} 
        />
        <StatBlock 
          label="Active Deploy" 
          value={stats.active} 
          icon={Zap} 
        />
        <StatBlock 
          label="Terminated" 
          value={stats.terminated} 
          icon={ShieldCheck} 
        />
      </div>
    </div>
  );
};

export default RequestAnalytics;