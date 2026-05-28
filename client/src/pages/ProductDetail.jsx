import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowLeft, ShieldCheck, MapPin, User, 
  Calendar, Zap, MessageSquare, Loader2, Clock
} from 'lucide-react';

import BrandSlider from '../components/BrandSlider';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Date States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Time & Location States
  const [pickupTime, setPickupTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');

  const handleRent = async (item) => {
    const user = localStorage.getItem('user');
    if(!user) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      alert("Protocol Error: Please select deployment and return dates.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      alert("Protocol Error: Return date must follow deployment date.");
      return;
    }
    if (!pickupTime || !returnTime) {
      alert("Protocol Error: Please select pickup and return times.");
      return;
    }
    if (!pickupLocation || !returnLocation) {
      alert("Protocol Error: Please enter pickup and return locations.");
      return;
    }

    try {
      const token = user ? JSON.parse(user).token : null;
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      
      await axios.post(`${BASE_URL}/api/booking/create/${item._id}`, {
        start: startDate,
        end: endDate,
        pickupTime: pickupTime,
        returnTime: returnTime,
        pickupLocation: pickupLocation,
        returnLocation: returnLocation
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Rental Initialized! Redirecting to Dashboard...");
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || "Protocol Error: Rental Initialization Failed");
    }
  }

  const handleContactOwner = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const BASE_URL = import.meta.env.VITE_BASE_URL;

      const res = await axios.post(`${BASE_URL}/api/chat`, 
        { userId: item.owner._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      navigate(`/messages/${res.data._id}`);
    } catch (error) {
      console.error("Protocol Error: Unable to initiate chat", error);
    }
  }

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const user = localStorage.getItem('user');
        if(!user) {
            navigate('/login');
            return;
        }
        const token = user ? JSON.parse(user).token : null;
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${BASE_URL}/api/item/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(response.data.item);
      } catch (error) {
        console.error("Protocol Error: Data Retrieval Failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#F2B82E] mb-4" size={40} />
        <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Initializing Asset Data...</span>
      </div>
    );
  }

  const diffDays = startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 selection:bg-[#F2B82E] selection:text-black font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Navigation */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-white/40 hover:text-[#F2B82E] transition-all mb-10 group w-max"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Archive</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Cinematic Visuals (Sticky) */}
          <motion.div className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 space-y-6">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5">
              <BrandSlider images={item.images} />
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                  ID: {id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Technical Specifications & Config */}
          <motion.div className="lg:col-span-6 xl:col-span-5 space-y-10">
            
            {/* Header Module */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F2B82E]">Available for Deployment</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] uppercase italic text-white">
                {item.title}
              </h1>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-3xl font-black text-white italic">₹{item.pricePerDay}</span>
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">/ Daily Rate</span>
              </div>
            </div>

            {/* Metadata Module */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2 text-[#F2B82E]">
                  <User size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Lender</span>
                </div>
                <p className="text-sm font-bold text-white/90">{item.owner.name}</p>
              </div>
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2 text-[#F2B82E]">
                  <MapPin size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
                </div>
                <p className="text-sm font-bold text-white/90 truncate">{item.owner.hostel} // {item.owner.roomNumber}</p>
              </div>
            </div>

            {/* Logistics Configuration Form */}
            <div className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] space-y-8">
              
              {/* Pickup Group */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/40 border-b border-white/10 pb-3">
                  <Calendar size={16} />
                  <span className="text-xs font-black uppercase tracking-widest text-white/70">Pickup Protocol</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Date</label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-medium text-white focus:border-[#F2B82E] focus:ring-1 focus:ring-[#F2B82E] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Time</label>
                    <input 
                      type="time" 
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-medium text-white focus:border-[#F2B82E] focus:ring-1 focus:ring-[#F2B82E] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Location</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Main Gate, Library..."
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-[#F2B82E] focus:ring-1 focus:ring-[#F2B82E] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Return Group */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/40 border-b border-white/10 pb-3">
                  <Clock size={16} />
                  <span className="text-xs font-black uppercase tracking-widest text-white/70">Return Protocol</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Date</label>
                    <input 
                      type="date" 
                      min={startDate || new Date().toISOString().split('T')[0]}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-medium text-white focus:border-[#F2B82E] focus:ring-1 focus:ring-[#F2B82E] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Time</label>
                    <input 
                      type="time" 
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-medium text-white focus:border-[#F2B82E] focus:ring-1 focus:ring-[#F2B82E] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Location</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Hostel A Lobby..."
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-[#F2B82E] focus:ring-1 focus:ring-[#F2B82E] outline-none transition-all"
                  />
                </div>
              </div>
              
              {/* Estimation Footer */}
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex items-end justify-between bg-black/30 p-4 rounded-xl border border-white/5">
                  <span className="text-xs font-black text-white/50 uppercase tracking-widest">Total Est:</span>
                  {diffDays > 0 ? (
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#F2B82E] leading-none">₹{diffDays * item.pricePerDay}</div>
                      <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{diffDays} Days</div>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-white/20 italic">Select Dates</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Module */}
            <div className="space-y-4">
              <motion.button 
                whileHover={{ scale: 1.01, backgroundColor: "#FFC83D" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#F2B82E] text-black py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(242,184,46,0.2)] hover:shadow-[0_0_30px_rgba(242,184,46,0.4)]"
                onClick={() => handleRent(item)} 
              >
                Initialize Exchange
                <Zap size={18} fill="currentColor" />
              </motion.button>

              <button 
                className="w-full py-5 border border-white/10 rounded-[1.5rem] text-white/60 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3" 
                onClick={() => handleContactOwner()}
              >
                Secure Channel Chat
                <MessageSquare size={16} />
              </button>
            </div>
            
            {/* Security Footer */}
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-white/5 opacity-60">
              <ShieldCheck className="text-[#F2B82E]" size={18} />
              <p className="text-[9px] font-bold text-white uppercase tracking-widest">
                Identity-verified via Institutional Protocol
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;