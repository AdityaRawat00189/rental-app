// It has All the Information of the product that is being booked, the user who booked it, the booking status, and the payment status.

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, MapPin, Clock, 
  Archive, Zap, ShieldCheck, Activity, Package
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LifecycleLogs = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.id || currentUser?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = currentUser?.token;
        if (!token) {
          navigate('/login');
          return;
        }
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const res = await axios.get(`${BASE_URL}/api/booking/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Protocol Error: Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUserId, navigate, currentUser?.token]);

  // --- Filtering Logic: Picked Up (Ongoing) AND Returned (Completed) ---
  const trackedExchanges = useMemo(() => {
    return bookings.filter(b => {
      // Add your exact backend status strings here
      const ongoingStatuses = ['PickedUp', 'Ongoing', 'Active'];
      const completedStatuses = ['Returned', 'Completed', 'Closed'];
      
      const isTracked = ongoingStatuses.includes(b.status) || completedStatuses.includes(b.status); 
      
      const isLender = b.owner?._id === currentUserId;
      const isRenter = b.renter?._id === currentUserId;
      
      return isTracked && (isLender || isRenter);
    });
  }, [bookings, currentUserId]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Zap className="animate-pulse text-[#F2B82E] mb-4" size={40} />
      <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Decrypting Logistics...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F2B82E] selection:text-black font-sans pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        
        {/* Navigation */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-white/40 hover:text-[#F2B82E] transition-all mb-10 group w-max"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Dashboard</span>
        </motion.button>

        {/* Header */}
        <header className="mb-12 space-y-4 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <Package className="text-white/80" size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
              Lifecycle <span className="text-white/40">Logs</span>
            </h1>
          </div>
          <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity size={14} className="text-[#F2B82E]" /> Tracking Picked Up & Returned Assets
          </p>
        </header>

        {/* Exchange Grid */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {trackedExchanges.length > 0 ? trackedExchanges.map((booking) => {
              const isLender = booking.owner?._id === currentUserId;
              const counterparty = isLender ? booking.renter : booking.owner;
              
              // Determine if it's currently ongoing vs completed
              const ongoingStatuses = ['PickedUp', 'Ongoing', 'Active'];
              const isOngoing = ongoingStatuses.includes(booking.status);
              
              return (
                <motion.div 
                  layout
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group border p-6 md:p-8 rounded-[2rem] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 transition-all duration-500 ${
                    isOngoing 
                      ? 'bg-[#0a0a0a] border-white/10 hover:border-white/20 shadow-lg' 
                      : 'bg-[#050505] border-white/5 hover:border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  
                  {/* Asset Identity & Status */}
                  <div className="flex items-start gap-5 w-full lg:w-[35%]">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-black border border-white/10 flex-shrink-0 overflow-hidden relative">
                      <img 
                        src={booking.item?.images[0]} 
                        className={`w-full h-full object-cover transition-all duration-700 ${isOngoing ? 'opacity-90 group-hover:scale-110' : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100'}`} 
                        alt="" 
                      />
                      {isOngoing ? (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
                      ) : (
                        <div className="absolute top-2 right-2 p-1 bg-black/60 backdrop-blur-sm rounded-full">
                          <CheckCircle2 size={12} className="text-white/60" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {isLender ? (
                          <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-[9px] font-black uppercase tracking-widest rounded-lg">
                            Lent Out
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-[9px] font-black uppercase tracking-widest rounded-lg">
                            Borrowed
                          </span>
                        )}

                        {isOngoing ? (
                          <span className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                            In Possession
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-lg">
                            Archived
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight truncate text-white leading-none">
                        {booking.item?.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                          Ref: {booking._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logistics Timeline */}
                  <div className="w-full lg:w-[40%] space-y-4 border-y lg:border-y-0 lg:border-x border-white/5 py-6 lg:py-0 lg:px-8">
                    
                    <div className={`space-y-2 ${!isOngoing && 'opacity-60'}`}>
                      <div className="flex items-center gap-2 text-white/40">
                        <Clock size={12} className={isOngoing ? "text-green-500" : ""} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isOngoing ? "text-green-500" : "text-white/60"}`}>
                          Pickup Executed
                        </span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex items-center justify-between">
                        <p className="text-xs font-bold text-white/80">
                          {new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                        </p>
                        <p className="text-[10px] text-white/40 flex items-center gap-1.5 max-w-[50%] truncate">
                          <MapPin size={12} className="text-white/20 flex-shrink-0"/> {booking.pickupLocation || 'Logged'}
                        </p>
                      </div>
                    </div>

                    <div className={`space-y-2 ${!isOngoing && 'opacity-60'}`}>
                      <div className="flex items-center gap-2 text-white/40">
                        <Clock size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          {isOngoing ? "Return Scheduled" : "Return Executed"}
                        </span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex items-center justify-between">
                        <p className="text-xs font-bold text-white/80">
                          {new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                        </p>
                        <p className="text-[10px] text-white/40 flex items-center gap-1.5 max-w-[50%] truncate">
                          <MapPin size={12} className="text-white/20 flex-shrink-0"/> {booking.returnLocation || 'Logged'}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Final Status */}
                  <div className="flex flex-col items-start lg:items-end justify-between w-full lg:w-[25%] gap-4">
                    <div className="text-left lg:text-right w-full flex items-center lg:items-end lg:flex-col justify-between lg:justify-start">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
                        Transacting With
                      </p>
                      <p className="text-lg font-black italic text-white/80 truncate max-w-[180px]">
                        {counterparty?.name || 'Unknown'}
                      </p>
                    </div>

                    <div className="w-full">
                      {isOngoing ? (
                        <div className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-inner">
                          <Activity size={14} className="animate-pulse" /> 
                          Currently Active
                        </div>
                      ) : (
                        <div className="w-full bg-white/5 border border-white/10 text-white/60 px-4 py-4 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-inner">
                          <ShieldCheck size={16} className="text-[#F2B82E]" /> 
                          Protocol Concluded
                        </div>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            }) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center border border-dashed border-white/10 bg-white/[0.01] rounded-[3rem]"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Archive className="text-white/20" size={32} />
                </div>
                <p className="text-white/40 font-black uppercase tracking-[0.2em] text-sm mb-2">No Active or Historical Logs</p>
                <p className="text-white/20 text-[10px] uppercase tracking-widest">You currently have no items picked up or returned.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default LifecycleLogs;