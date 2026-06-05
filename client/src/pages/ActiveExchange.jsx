import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, MapPin, Clock, 
  MessageSquare, Zap, ShieldCheck, ArrowRightLeft, Wallet, AlertCircle,
  Banknote, CreditCard, X
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ActiveExchanges = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Payment Modal State ---
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, bookingId: null, price: { total: 0, securityDeposit: 0 } });
  const [onlineError, setOnlineError] = useState("");

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

  // --- Filtering Logic ---
  const activeExchanges = useMemo(() => {
    return bookings.filter(b => {
      if (!['Approved', 'PickedUp'].includes(b.status)) return false; 
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
      alert("Protocol Error: Unable to connect secure channel.");
    }
  };

  // --- Financial Transaction Logic ---
  const handlePaymentUpdate = async (bookingId) => {
    try {
      const token = currentUser?.token;
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      
      const response = await axios.patch(`${BASE_URL}/api/booking/payment/${bookingId}`, 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the booking with the new payment status from the backend
      setBookings(prev => prev.map(b => b._id === bookingId ? response.data.booking : b));
    } catch (error) {
      console.error("Payment update failed:", error);
    }
  };

  // --- Portal Handlers ---
  const openPaymentPortal = (bookingId, price) => {
    setOnlineError("");
    setPaymentModal({ isOpen: true, bookingId, price });
  };

  const closePaymentPortal = () => {
    setPaymentModal({ isOpen: false, bookingId: null, price: 0 });
    setTimeout(() => setOnlineError(""), 300); // Clear error after animation
  };

  const executeCashPayment = async () => {
    await handlePaymentUpdate(paymentModal.bookingId);
    closePaymentPortal();
  };

  const executeOnlinePayment = () => {
    setOnlineError("Transaction Declined: Gateway unavailable.");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Zap className="animate-pulse text-[#F2B82E] mb-4" size={40} />
      <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Verifying Active Contracts...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F2B82E] selection:text-black font-sans pt-24 pb-20 relative">
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
              
              // New Payment State Variables
              const isPaid = booking.paymentStatus?.status === 'Paid';
              const hasOwnerConfirmed = booking.paymentStatus?.ownerConfirmed;
              const hasRenterConfirmed = booking.paymentStatus?.renterConfirmed;
              
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
                          <span>₹{booking.totalPrice?.total || 0}</span>
                          <span className="block text-[8px] text-white/40">Security: ₹{booking.totalPrice?.securityDeposit || 0}</span>
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
                          <CheckCircle2 size={14} /> Handover & Payment Cleared
                        </div>
                      ) : (
                        <>
                          {!isLender ? (
                            // Borrower View
                            hasRenterConfirmed ? (
                              <div className="w-full bg-[#F2B82E]/10 border border-[#F2B82E]/20 text-[#F2B82E] px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Clock size={14} /> Awaiting Owner Confirmation
                              </div>
                            ) : (
                              <div className="space-y-1 w-full">
                                <button 
                                  onClick={() => openPaymentPortal(booking._id, booking.totalPrice)}
                                  className="w-full bg-[#F2B82E] text-black px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(242,184,46,0.2)]"
                                >
                                  <Wallet size={14} /> Pay Now (₹{booking.totalPrice?.total || 0})
                                </button>
                                <p className="text-[8px] font-bold text-red-400/80 uppercase tracking-widest text-center flex items-center justify-center gap-1 mt-1.5">
                                  <AlertCircle size={10} /> Always pay when both parties are available
                                </p>
                              </div>
                            )
                          ) : (
                            // Lender View
                            hasOwnerConfirmed ? (
                              <div className="w-full bg-[#F2B82E]/10 border border-[#F2B82E]/20 text-[#F2B82E] px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Clock size={14} /> Awaiting Renter Confirmation
                              </div>
                            ) : (
                              <button 
                                onClick={() => handlePaymentUpdate(booking._id)}
                                className="w-full bg-transparent border border-[#F2B82E]/50 text-[#F2B82E] px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F2B82E] hover:text-black active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle2 size={14} /> Mark Payment Received
                              </button>
                            )
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

      {/* --- PAYMENT PORTAL OVERLAY --- */}
      <AnimatePresence>
        {paymentModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePaymentPortal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={closePaymentPortal}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">
                  Settle <span className="text-[#F2B82E]">Payment</span>
                </h2>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Total: <span className="text-white">₹{paymentModal.price?.total || 0}</span>
                  <span className="block text-[10px] text-white/40 mt-1">Security Deposit: ₹{paymentModal.price?.securityDeposit || 0}</span>
                </p>
              </div>

              <div className="space-y-4">
                {/* Option 1: Cash (Fixed Overflow) */}
                <button 
                  onClick={executeCashPayment}
                  className="w-full flex items-start justify-between p-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-green-500/10 hover:border-green-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-green-500/20 transition-colors mt-1 flex-shrink-0">
                      <Banknote size={20} className="text-white group-hover:text-green-500" />
                    </div>
                    
                    <div className="text-left flex flex-col gap-1.5 flex-1 min-w-0">
                      <p className="text-sm font-black uppercase tracking-widest text-white group-hover:text-green-500 transition-colors truncate">Cash on Handover</p>
                      <p className="text-[10px] text-white/40 font-medium leading-snug">Pay directly during the physical meetup</p>
                      
                      <div className="flex items-start gap-1.5 mt-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-2 rounded-lg w-full">
                        <AlertCircle size={10} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-[8px] font-black text-red-400 uppercase tracking-widest whitespace-normal leading-tight">
                          Note: We will not be responsible for refund
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Option 2: Online */}
                <button 
                  onClick={executeOnlinePayment}
                  className="w-full flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-red-500/20 transition-colors flex-shrink-0">
                      <CreditCard size={20} className="text-white group-hover:text-red-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black uppercase tracking-widest text-white group-hover:text-red-500 transition-colors">Pay Online</p>
                      <p className="text-[10px] text-white/40 font-medium">UPI, Cards, Netbanking</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Error Message Animation */}
              <AnimatePresence>
                {onlineError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, mt: 0 }}
                    animate={{ opacity: 1, height: 'auto', mt: 16 }}
                    exit={{ opacity: 0, height: 0, mt: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-start gap-3">
                      <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-400/90 leading-relaxed">
                        {onlineError}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ActiveExchanges;