import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowLeft, ShieldCheck, MapPin, User, 
  Calendar, Zap, MessageSquare, Info, Loader2 ,Phone
} from 'lucide-react';

import BrandSlider from '../components/BrandSlider';
// import ChatDrawer from '../components/ChatDrawer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen , setChatOpen] = useState(false);

  const handleRent = async (item) => {
    const user = localStorage.getItem('user');
    if(!user) {
      navigate('/login');
      return;
    }
    try {
      const token = user ? JSON.parse(user).token : null;
      console.log("Initiating booking for item:", item._id, "with token:", token);
      await axios.post(`http://localhost:3000/api/booking/create/${item._id}`, {} , {
        headers: {Authorization : `Bearer ${token}`},
      })
      alert("Rental Initialized! Please check your dashboard for details.");
      navigate('/dashboard');
    } catch (error) {
      alert("Protocol Error: Rental Initialization Failed");
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
        const response = await axios.get(`http://localhost:3000/api/item/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("Fetched Item Details:", response.data.item);
        setItem(response.data.item);
      } catch (error) {
        console.error("Protocol Error: Data Retrieval Failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#F2B82E] mb-4" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Initializing Asset Data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 selection:bg-[#F2B82E] selection:text-black">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Navigation / Back Button */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-white/40 hover:text-[#F2B82E] transition-all mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to Archive</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: Cinematic Visuals (7 Columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="relative rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/5 group">
              {/* <img 
                src={item.images[0]} 
                alt={item.title} 
                className="w-full h-[600px] object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 grayscale-[0.3] group-hover:grayscale-0"
              /> */}
              <BrandSlider images = {item.images}></BrandSlider>
              <div className="absolute top-8 left-8 z-1">
                <span className="bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]">
                  Asset ID: {id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Technical Specifications (5 Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-10"
          >
            {/* Header Module */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F2B82E]">Available for Deployment</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
                {item.title}
              </h1>
              <div className="flex items-center gap-4 pt-4">
                <span className="text-4xl font-black text-white italic">₹{item.pricePerDay}</span>
                <span className="text-white/20 text-xs font-bold uppercase tracking-widest">/ Daily Rate</span>
              </div>
            </div>

            {/* Description Module */}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-4 text-white/40">
                <Info size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Specifications</span>
              </div>
              <p className="text-gray-400 font-light leading-relaxed text-lg">
                {item.description || "No technical documentation provided for this specific asset. Peer-to-peer verification recommended upon handoff."}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                <User size={18} className="text-[#F2B82E] mb-3" />
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Verified Lender</p>
                <p className="text-white font-bold">{item.owner.name}</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                <Phone size={18} className="text-[#F2B82E] mb-3" />
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Secure Channel</p>
                <p className="text-white font-bold tracking-tighter">+91 {item.owner.contactNumber || "XXXXXXXXXX"}</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                <MapPin size={18} className="text-[#F2B82E] mb-3" />
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Deployment</p>
                <p className="text-white font-bold">{item.owner.hostel} // {item.owner.roomNumber}</p>
              </div>
            </div>

            {/* Action Module */}
            <div className="pt-10 space-y-4">
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#fff" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#F2B82E] text-black py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-[0_20px_40px_rgba(242,184,46,0.1)]" onClick = {() => handleRent(item)} 
              >
                Initialize Exchange
                <Zap size={18} fill="currentColor" />
              </motion.button>

              <button className="w-full py-6 border border-white/10 rounded-[2rem] text-white/40 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-4" onClick={() => setChatOpen(true)}>
                Chat with Lender
                <MessageSquare size={16} />
              </button>
              {isChatOpen && <ChatDrawer itemId={item._id} itemName={item.title} currentUser={localStorage.getItem('user')} isOpen={isChatOpen} onClose={() => setChatOpen(false)} ></ChatDrawer>}
            </div>

            {/* Security Footer */}
            <div className="flex items-center gap-4 pt-10 border-t border-white/5">
              <ShieldCheck className="text-white/20" size={24} />
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
                Peer Protection enabled. Transactions are logged and identity-verified via Institutional Protocol.
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;