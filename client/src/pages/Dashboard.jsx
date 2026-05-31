import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Handshake, Wallet, Star, 
  Plus, Search, ArrowRight, Shield, Zap, Clock, Info, X, Check, MapPin, MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState('renter'); // 'renter' or 'lender'
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.id || currentUser?._id;

  const fetchData = async () => {
    try {
      const token = currentUser?.token;
      if (!token) return;
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const res = await axios.get(`${BASE_URL}/api/booking/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      // console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [currentUserId, refreshTrigger]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = currentUser?.token;
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      await axios.patch(`${BASE_URL}/api/booking/status/${bookingId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefreshTrigger(prev => prev + 1);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert("Protocol Error: Status update failed.");
    }
  };

  // --- NEW: Handle opening chat with the counterparty ---
  const handleChat = async (booking) => {
    try {
      // Determine who you should chat with based on your current view
      const counterpartyId = view === 'lender' 
        ? (booking.renter?._id || booking.renter) 
        : (booking.owner?._id || booking.owner);

      if (!counterpartyId) return;

      const token = currentUser?.token;
      const BASE_URL = import.meta.env.VITE_BASE_URL;

      const res = await axios.post(`${BASE_URL}/api/chat`, 
        { userId: counterpartyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/messages/${res.data._id}`);
    } catch (error) {
      // console.error("Protocol Error: Unable to initiate chat", error);
      alert("Protocol Error: Unable to connect secure channel.");
    }
  };

  const filteredData = useMemo(() => {
    return bookings.filter(b => {
      const isRenterView = view === 'renter' && b.renter?._id === currentUserId;
      const isLenderView = view === 'lender' && b.owner?._id === currentUserId;
      const matchesSearch = b.item?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return (isRenterView || isLenderView) && matchesSearch;
    });
  }, [bookings, view, searchTerm, currentUserId]);

  const stats = useMemo(() => {
    const asLender = bookings.filter(b => b.owner?._id === currentUserId);
    return {
      activeRentals: bookings.filter(b => b.renter?._id === currentUserId && b.status === 'Approved').length,
      earnings: asLender.filter(b => b.status === 'Approved').reduce((acc, curr) => acc + (curr.totalPrice || 0), 0),
      trustScore: 4.9
    };
  }, [bookings, currentUserId]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Zap className="animate-pulse text-[#F2B82E] mb-4" size={40} />
      <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Syncing Protocol Data...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F2B82E] selection:text-black font-sans">
      

      <main className="lg:pl-20 pb-20">
        
        {/* Header Module */}
        <header className="pt-20 lg:pt-24 pb-12 px-6 md:px-8 max-w-7xl mx-auto border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                Command <span className="text-[#F2B82E]">Center</span>
              </h1>
              <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                <Shield size={14} className="text-[#F2B82E]" /> Active Transaction Archives
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
               <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter Archives..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-medium focus:border-[#F2B82E] focus:ring-1 focus:ring-[#F2B82E] outline-none transition-all"
                />
               </div>
               <button 
                 onClick={() => navigate('/lend')} 
                 className="bg-[#F2B82E] text-black px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(242,184,46,0.15)] flex items-center justify-center gap-2 flex-shrink-0"
               >
                 <Plus size={16} /> New Asset
               </button>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-8 max-w-7xl mx-auto space-y-10 pt-10">
          
          {/* METRIC GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <StatCard label="Active Deployments" value={stats.activeRentals} icon={<ShoppingCart size={24}/>} />
            <StatCard label="Protocol Earnings" value={`₹${stats.earnings}`} icon={<Wallet size={24}/>} />
            <StatCard label="Trust Index" value={stats.trustScore} icon={<Star size={24}/>} />
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex items-center gap-2 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 w-fit">
            {['renter', 'lender'].map((role) => (
              <button 
                key={role}
                onClick={() => setView(role)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  view === role 
                    ? 'bg-[#F2B82E] text-black shadow-[0_0_15px_rgba(242,184,46,0.2)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                As {role}
              </button>
            ))}
          </div>

          {/* TRANSACTION LOGS */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredData.length > 0 ? filteredData.map(booking => (
                <motion.div 
                  layout
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-[#0a0a0a] border border-white/5 p-5 md:p-6 rounded-[2rem] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 hover:border-white/10 transition-all"
                >
                  {/* Asset Info */}
                  <div className="flex items-center gap-5 w-full xl:w-1/4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black border border-white/10 flex-shrink-0 overflow-hidden relative">
                      <img src={booking.item?.images[0]} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tight truncate">{booking.item?.title}</h3>
                      <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase mt-1">ID: {booking._id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Logistics Timeline */}
                  <div className="w-full xl:flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-8 border-y xl:border-y-0 xl:border-x border-white/5 py-5 xl:py-0 xl:px-8">
                    
                    {/* Deployment */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#F2B82E]">
                        <Clock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Deployment</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white/90">
                          {new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                          {booking.pickupTime && <span className="text-white/40 ml-2">• {booking.pickupTime}</span>}
                        </p>
                        {booking.pickupLocation && (
                          <p className="text-xs text-white/50 flex items-center gap-1.5">
                            <MapPin size={12} /> <span className="truncate">{booking.pickupLocation}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Return */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/40">
                        <Clock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white/90">
                          {new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                          {booking.returnTime && <span className="text-white/40 ml-2">• {booking.returnTime}</span>}
                        </p>
                        {booking.returnLocation && (
                          <p className="text-xs text-white/50 flex items-center gap-1.5">
                            <MapPin size={12} /> <span className="truncate">{booking.returnLocation}</span>
                          </p>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Pricing & Status Actions */}
                  <div className="flex xl:flex-col items-center xl:items-end justify-between w-full xl:w-[220px] gap-4">
                    <div className="text-left xl:text-right">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Value</p>
                      <p className="text-2xl md:text-3xl font-black italic text-[#F2B82E]">₹{booking.totalPrice || 0}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      
                      {/* --- NEW: Secure Channel Chat Button --- */}
                      <button 
                        onClick={() => handleChat(booking)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:bg-[#F2B82E]/10 hover:text-[#F2B82E] hover:border-[#F2B82E]/30 transition-all shadow-sm"
                        title={view === 'lender' ? "Message Requester" : "Message Owner"}
                      >
                        <MessageSquare size={16} />
                      </button>

                      {/* Accept/Reject or Status Badge */}
                      {view === 'lender' && booking.status === 'Pending' ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'Cancelled')} 
                            className="bg-white/5 text-white/60 p-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                            title="Reject"
                          >
                            <X size={16}/>
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'Approved')} 
                            className="bg-[#F2B82E] text-black px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(242,184,46,0.2)]"
                          >
                            <Check size={16}/> Accept
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center justify-center text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border ${
                          booking.status === 'Approved' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 
                          booking.status === 'Pending' ? 'border-[#F2B82E]/30 text-[#F2B82E] bg-[#F2B82E]/10' : 
                          booking.status === 'Cancelled' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                          'border-white/10 text-white/40 bg-white/5'
                        }`}>
                          {booking.status}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-24 text-center border border-dashed border-white/10 bg-white/[0.01] rounded-[3rem]"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="text-white/40" size={24} />
                  </div>
                  <p className="text-white/40 font-black uppercase tracking-[0.2em] text-xs">No Archived Logs Found</p>
                  <p className="text-white/20 text-[10px] mt-2">Adjust your filters or switch views.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-[2rem] relative overflow-hidden group hover:border-white/10 transition-colors">
    <div className="absolute -top-4 -right-4 p-8 text-white/[0.03] group-hover:text-[#F2B82E]/10 transition-colors duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
      {React.cloneElement(icon, { size: 80 })}
    </div>
    <div className="relative z-10">
      <div className="text-white/40 mb-4">{icon}</div>
      <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2 uppercase text-white">{value}</h3>
      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{label}</p>
    </div>
  </div>
);

export default Dashboard;