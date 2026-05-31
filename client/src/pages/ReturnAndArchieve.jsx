import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, MapPin, Clock, 
  Archive, Zap, AlertTriangle, ShieldAlert, CheckSquare, History, AlertOctagon
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';

const ReturnsAndArchive = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  }, [currentUserId, navigate, currentUser?.token, refreshTrigger]);

  // --- DUAL VERIFICATION: Mark Item as Returned ---
  const handleMarkReturned = async (bookingId) => {
    try {
      const token = currentUser?.token;
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      
      // Hitting a dedicated return endpoint that toggles this specific user's boolean in the DB
      await axios.patch(`${BASE_URL}/api/booking/completion/${bookingId}`, 
        {}, // Empty body, backend deduces role from the JWT token
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRefreshTrigger(prev => prev + 1); // Refresh data to show "Awaiting Counterparty" or move to Archives
    } catch (error) {
      console.error(error);
      alert("Protocol Error: Failed to register return handshake.");
    }
  };

  // --- Initiate Penalty for Damages ---
  const handleInitiatePenalty = async (bookingId) => {
    const confirmPenalty = window.confirm(
      "WARNING: You are about to initiate a penalty protocol for a damaged or missing asset. Proceed?"
    );
    if (!confirmPenalty) return;

    try {
      const token = currentUser?.token;
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      await axios.patch(`${BASE_URL}/api/booking/penalty/${bookingId}`, 
        { penaltyStatus: 'Initiated', status: 'Disputed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Penalty Protocol Initiated. Institutional mediation will commence.");
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Protocol Error: Penalty initiation failed", error);
      alert("Protocol Error: Unable to initiate penalty.");
    }
  };

  // --- Data Processing ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pendingReturns = useMemo(() => {
    return bookings.filter(b => {
      const ongoingStatuses = ['PickedUp', 'Ongoing', 'Active', 'Return Requested'];
      if (!ongoingStatuses.includes(b.status)) return false;
      return (b.owner?._id === currentUserId || b.renter?._id === currentUserId);
    }).sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  }, [bookings, currentUserId]);

  const completedExchanges = useMemo(() => {
    return bookings.filter(b => {
      const completedStatuses = ['Returned', 'Completed', 'Closed', 'Disputed'];
      if (!completedStatuses.includes(b.status)) return false;
      return (b.owner?._id === currentUserId || b.renter?._id === currentUserId);
    }).sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
  }, [bookings, currentUserId]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Zap className="animate-pulse text-[#F2B82E] mb-4" size={40} />
      <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Syncing End-of-Life Assets...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F2B82E] selection:text-black font-sans flex">
      
      {/* <Sidebar /> */}

      <main className="flex-1 lg:pl-20 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          
          <header className="mb-12 space-y-4 border-b border-white/5 pb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                <ShieldAlert className="text-red-500" size={28} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                Returns & <span className="text-white/40">Archives</span>
              </h1>
            </div>
            <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Archive size={14} className="text-[#F2B82E]" /> Overdue Assets & Completed Lifecycles
            </p>
          </header>

          <div className="space-y-16">
            
            {/* =========================================
                SECTION 1: PENDING & OVERDUE RETURNS
                ========================================= */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-[#F2B82E]" size={20} />
                <h2 className="text-xl font-black uppercase tracking-widest text-white">Pending Returns</h2>
                <div className="h-px bg-white/10 flex-1 ml-4"></div>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {pendingReturns.length > 0 ? pendingReturns.map((booking) => {
                    const isLender = booking.owner?._id === currentUserId;
                    const counterparty = isLender ? booking.renter : booking.owner;
                    
                    const endDate = new Date(booking.endDate);
                    endDate.setHours(0, 0, 0, 0);
                    const isOverdue = endDate < today;

                    // --- Extract Dual Verification Logic ---
                    const verification = booking.returnVerification || {};
                    const iHaveConfirmed = isLender ? verification.ownerConfirmed : verification.renterConfirmed;
                    const theyHaveConfirmed = isLender ? verification.renterConfirmed : verification.ownerConfirmed;

                    return (
                      <motion.div 
                        layout
                        key={booking._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`group border p-6 rounded-[2rem] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all ${
                          isOverdue 
                            ? 'bg-red-500/5 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:border-red-500/50' 
                            : 'bg-[#0a0a0a] border-white/10 hover:border-[#F2B82E]/30'
                        }`}
                      >
                        {/* Asset Info */}
                        <div className="flex items-center gap-4 w-full lg:w-[30%]">
                          <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border ${isOverdue ? 'border-red-500/50' : 'border-white/10'}`}>
                            <img src={booking.item?.images[0]} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="min-w-0 flex-1">
                            {isOverdue && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-widest rounded mb-1">
                                <AlertTriangle size={10} /> Deadline Exceeded
                              </span>
                            )}
                            <h3 className="text-lg font-black uppercase italic tracking-tight truncate">{booking.item?.title}</h3>
                            <p className="text-[9px] font-bold text-white/40 tracking-[0.2em] uppercase mt-0.5">Role: {isLender ? 'Owner' : 'Borrower'}</p>
                          </div>
                        </div>

                        {/* Logistics */}
                        <div className="w-full lg:w-[30%] px-0 lg:px-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <Clock size={12} className={isOverdue ? 'text-red-400' : 'text-[#F2B82E]'}/> Return Due
                          </p>
                          <p className={`text-sm font-bold ${isOverdue ? 'text-red-400' : 'text-white/90'}`}>
                            {new Date(booking.endDate).toLocaleDateString()} <span className="text-white/40 font-normal text-xs ml-1">• {booking.returnTime}</span>
                          </p>
                          <p className="text-[10px] text-white/40 mt-1 truncate">
                            <span className="font-bold">Loc:</span> {booking.returnLocation || 'TBD'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="w-full lg:w-[40%] flex flex-col items-start lg:items-end gap-3">
                          <div className="text-left lg:text-right w-full">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">With</p>
                            <p className="text-sm font-bold truncate">{counterparty?.name}</p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 w-full lg:justify-end">
                            {/* Damage/Penalty Button - ONLY VISIBLE TO OWNER */}
                            {isLender && !iHaveConfirmed && (
                              <button 
                                onClick={() => handleInitiatePenalty(booking._id)}
                                className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white"
                                title="Report item as damaged or missing"
                              >
                                <AlertOctagon size={14} /> Penalty
                              </button>
                            )}

                            {/* --- DUAL VERIFICATION UI LOGIC --- */}
                            <div className="w-full sm:w-auto flex-1 max-w-[250px]">
                              {iHaveConfirmed && !theyHaveConfirmed ? (
                                <div className="w-full py-2.5 border border-[#F2B82E]/30 bg-[#F2B82E]/5 text-[#F2B82E]/80 text-center rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 h-full">
                                  <Clock size={14} className="animate-pulse" /> Awaiting Counterparty
                                </div>
                              ) 
                              : !iHaveConfirmed && theyHaveConfirmed ? (
                                <div className="w-full space-y-2">
                                  <p className="text-[8px] text-[#F2B82E] uppercase tracking-widest text-center animate-pulse">
                                    Counterparty initiated return
                                  </p>
                                  <button 
                                    onClick={() => handleMarkReturned(booking._id)}
                                    className="w-full py-2.5 bg-[#F2B82E] text-black hover:bg-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(242,184,46,0.3)]"
                                  >
                                    <CheckSquare size={14} /> Verify Handshake
                                  </button>
                                </div>
                              ) 
                              : (
                                <button 
                                  onClick={() => handleMarkReturned(booking._id)}
                                  className={`w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all h-full ${
                                    isOverdue
                                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50'
                                      : 'bg-transparent border border-[#F2B82E]/50 text-[#F2B82E] hover:bg-[#F2B82E] hover:text-black'
                                  }`}
                                >
                                  <CheckSquare size={14} /> Mark Returned
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="p-10 border border-dashed border-white/10 bg-white/[0.01] rounded-3xl flex flex-col items-center justify-center">
                      <CheckCircle2 className="text-white/20 mb-3" size={28} />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">No assets pending return.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* =========================================
                SECTION 2: COMPLETED & ARCHIVED
                ========================================= */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <History className="text-white/40" size={20} />
                <h2 className="text-xl font-black uppercase tracking-widest text-white/40">Completed Archives</h2>
                <div className="h-px bg-white/10 flex-1 ml-4"></div>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {completedExchanges.length > 0 ? completedExchanges.map((booking) => {
                    const isLender = booking.owner?._id === currentUserId;
                    const counterparty = isLender ? booking.renter : booking.owner;
                    const isDisputed = booking.status === 'Disputed';

                    return (
                      <motion.div 
                        layout
                        key={booking._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`group border p-5 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 ${
                          isDisputed 
                            ? 'bg-red-500/5 border-red-500/20 opacity-100' 
                            : 'bg-[#050505] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                        }`}
                      >
                        {/* Asset Info */}
                        <div className="flex items-center gap-4 w-full md:w-1/3">
                          <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border relative ${isDisputed ? 'border-red-500/30' : 'border-white/5'}`}>
                            <img src={booking.item?.images[0]} className={`w-full h-full object-cover transition-all duration-500 ${isDisputed ? '' : 'grayscale group-hover:grayscale-0'}`} alt="" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              {isDisputed ? <AlertOctagon size={16} className="text-red-500" /> : <CheckCircle2 size={16} className="text-white/60" />}
                            </div>
                          </div>
                          <div>
                            <h3 className={`text-base font-black uppercase italic tracking-tight ${isDisputed ? 'text-red-400' : 'text-white/80'}`}>{booking.item?.title}</h3>
                            <p className="text-[9px] font-bold text-white/40 tracking-[0.2em] uppercase mt-0.5">Role: {isLender ? 'Owner' : 'Borrower'}</p>
                          </div>
                        </div>

                        {/* Logistics */}
                        <div className="w-full md:w-1/3 px-0 md:px-4 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Status Date</p>
                          <p className={`text-xs font-bold ${isDisputed ? 'text-red-400' : 'text-white/60'}`}>
                            {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Status Label */}
                        <div className="w-full md:w-1/4 flex flex-col items-start md:items-end gap-1">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">With: {counterparty?.name}</p>
                          {isDisputed ? (
                            <span className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                              Under Dispute / Penalty
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-lg">
                              Protocol Closed
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="p-10 border border-dashed border-white/10 bg-white/[0.01] rounded-3xl flex flex-col items-center justify-center">
                      <Archive className="text-white/20 mb-3" size={28} />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Archive is empty.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ReturnsAndArchive;