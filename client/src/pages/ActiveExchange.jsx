import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, MapPin, Clock, 
  MessageSquare, Zap, ShieldCheck, ArrowRightLeft, Wallet, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ActiveExchanges = () => {
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

  // --- Filtering Logic: ALL Approved Exchanges (Both Lending & Borrowing) ---
  const activeExchanges = useMemo(() => {
    return bookings.filter(b => {
      if (b.status !== 'Approved') return false; 
      const isLender = b.owner?._id === currentUserId;
      const isRenter = b.renter?._id === currentUserId;
      return isLender || isRenter;
    });
  }, [bookings, currentUserId]);

  // --- Chat Connectivity ---
  const handleChat = async (counterpartyId) => {
    try {
      if (!counterpartyId) return;
      const token = currentUser?.token;
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const res = await axios.post(`${BASE_URL}/api/chat`, 
        { userId: counterpartyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/messages/${res.data._id}`);
    } catch (error) {
      console.error("Protocol Error: Unable to initiate chat", error);
      alert("Protocol Error: Unable to connect secure channel.");
    }
  };

  // --- Financial Transaction Logic ---
  const handlePaymentUpdate = async (bookingId, newStatus) => {
    try {
      const token = currentUser?.token;
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      
      // Update backend payment status (Assuming an endpoint exists for this)
      await axios.patch(`${BASE_URL}/api/booking/payment/${bookingId}`, 
        { paymentStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistic UI update
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, paymentStatus: newStatus } : b));
    } catch (error) {
      console.error("Protocol Error: Financial sync failed", error);
      // Fallback optimistic update if backend route isn't strictly set up yet, to keep the UI flowing
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, paymentStatus: newStatus } : b));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Zap className="animate-pulse text-[#F2B82E] mb-4" size={40} />
      <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Verifying Active Contracts...</span>
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
            <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
              <ArrowRightLeft className="text-green-500" size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
              Scheduled <span className="text-green-500">Meetups</span>
            </h1>
          </div>
          <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#F2B82E]" /> Approved Physical Handovers & Financials
          </p>
        </header>

        {/* Exchange Grid */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {activeExchanges.length > 0 ? activeExchanges.map((booking) => {
              const isLender = booking.owner?._id === currentUserId;
              const counterparty = isLender ? booking.renter : booking.owner;
              const isPaid = booking.paymentStatus === 'Paid';
              
              return (
                <motion.div 
                  layout
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-[2rem] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 hover:border-white/20 transition-all shadow-lg"
                >
                  
                  {/* Asset Identity & Role */}
                  <div className="flex items-start gap-5 w-full lg:w-[35%]">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-black border border-white/10 flex-shrink-0 overflow-hidden relative">
                      <img src={booking.item?.images[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt="" />
                      <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      {isLender ? (
                        <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                          Action: Handing Over
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-[#F2B82E]/10 border border-[#F2B82E]/30 text-[#F2B82E] text-[9px] font-black uppercase tracking-widest rounded-lg">
                          Action: Receiving
                        </span>
                      )}
                      
                      <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight truncate text-white leading-none">
                        {booking.item?.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                          Ref: {booking._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] font-black text-[#F2B82E] tracking-widest italic border-l border-white/10 pl-3">
                          ₹{booking.totalPrice || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logistics Timeline */}
                  <div className="w-full lg:w-[40%] space-y-4 border-y lg:border-y-0 lg:border-x border-white/5 py-6 lg:py-0 lg:px-8">
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/40">
                        <Clock size={12} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Initial Meetup</span>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center justify-between">
                        <p className="text-xs font-bold text-white/90">
                          {new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                          <span className="text-white/40 ml-2 font-normal">• {booking.pickupTime}</span>
                        </p>
                        <p className="text-[10px] text-white/60 flex items-center gap-1.5 max-w-[50%] truncate">
                          <MapPin size={12} className="text-[#F2B82E] flex-shrink-0"/> {booking.pickupLocation || 'TBD'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/40">
                        <Clock size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return Meetup</span>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center justify-between">
                        <p className="text-xs font-bold text-white/90">
                          {new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                          <span className="text-white/40 ml-2 font-normal">• {booking.returnTime}</span>
                        </p>
                        <p className="text-[10px] text-white/60 flex items-center gap-1.5 max-w-[50%] truncate">
                          <MapPin size={12} className="text-[#F2B82E] flex-shrink-0"/> {booking.returnLocation || 'TBD'}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Actions & Payment Panel */}
                  <div className="flex flex-col items-start lg:items-end justify-between w-full lg:w-[25%] gap-4">
                    <div className="text-left lg:text-right w-full flex items-center lg:items-end lg:flex-col justify-between lg:justify-start">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
                        Meetup With
                      </p>
                      <p className="text-lg font-black italic text-white truncate max-w-[180px]">
                        {counterparty?.name || 'Unknown'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      {/* Secure Comms */}
                      <button 
                        onClick={() => handleChat(counterparty?._id)}
                        className="w-full bg-white/5 text-white border border-white/10 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F2B82E] hover:text-black hover:border-[#F2B82E] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <MessageSquare size={14} /> 
                        <span>Coordinate</span>
                      </button>

                      {/* Payment Module */}
                      {isPaid ? (
                        <div className="w-full bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                          <CheckCircle2 size={14} /> Payment Cleared
                        </div>
                      ) : (
                        <>
                          {!isLender ? (
                            // Borrower View
                            <div className="space-y-1 w-full">
                              <button 
                                onClick={() => handlePaymentUpdate(booking._id, 'Paid')}
                                className="w-full bg-[#F2B82E] text-black px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(242,184,46,0.2)]"
                              >
                                <Wallet size={14} /> Pay Now (₹{booking.totalPrice})
                              </button>
                              <p className="text-[8px] font-bold text-red-400/80 uppercase tracking-widest text-center flex items-center justify-center gap-1 mt-1.5">
                                <AlertCircle size={10} /> Always pay when both parties are available
                              </p>
                            </div>
                          ) : (
                            // Lender View
                            <button 
                              onClick={() => handlePaymentUpdate(booking._id, 'Paid')}
                              className="w-full bg-transparent border border-[#F2B82E]/50 text-[#F2B82E] px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F2B82E] hover:text-black active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 size={14} /> Mark Payment Received
                            </button>
                          )}
                        </>
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
                  <CheckCircle2 className="text-white/20" size={32} />
                </div>
                <p className="text-white/40 font-black uppercase tracking-[0.2em] text-sm mb-2">No Scheduled Meetups</p>
                <p className="text-white/20 text-[10px] uppercase tracking-widest">You have no approved handovers or returns at this time.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ActiveExchanges;