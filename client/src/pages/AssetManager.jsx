import React, {useEffect, useState} from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, EyeOff, Edit3, Trash2, ShieldAlert, Box, Zap, Layers, Handshake, LayoutDashboard } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AssetManager = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchMyAssets = async() => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const BASE_URL = import.meta.env.VITE_BASE_URL;

                const res = await axios.get(`${BASE_URL}/api/item/my-items`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                })

                setItems(res.data.items);
            } catch (error) {
                // console.error("Inventory Sync Failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyAssets();

    }, [refresh]);

    const handleUpdateStatus = async(itemId, newStatus) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const BASE_URL = import.meta.env.VITE_BASE_URL;

            await axios.put(`${BASE_URL}/api/item/update-status/${itemId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${user.token}`}}
            )
            
        } catch (error) {
            // console.error("Status Update Failed", error);
        } finally {
            setRefresh(prev => !prev);
        }
    }

    const habdleDelete = async(itemId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const BASE_URL = import.meta.env.VITE_BASE_URL;

            await axios.delete(`${BASE_URL}/api/item/delete/${itemId}`, 
                { headers: { Authorization: `Bearer ${user.token}` }}
            )
        } catch (error) {
            // console.error("Deletion Failed", error);
        } finally {
            setRefresh(prev => !prev);
        }
    }
    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
          <Zap className="animate-pulse text-[#F2B82E] mb-4" size={40} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Requesting....</span>
        </div>
      );

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-8 ">
            
            <div className="max-w-7xl mx-auto">

                {/* Header Module */}
                <header className=" flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 " >
                    <div className="space-y-2">
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
                            Asset <span className="text-[#F2B82E]">Inventory</span>
                        </h1>
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]" >
                            Central Warehousing // Total Assets: {items.length}
                        </p>
                    </div>
                    <button className="bg-[#F2B82E] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-all shadow-lg shadow-[#F2B82E]/10 " onClick={() => navigate('/lend')} >
                        <Plus size={16} strokeWidth={3}/> Register New Gear
                    </button>
                </header> 

                {/* Inventory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={{opacity: 0, scale: 0.95}}
                                animate={{opacity: 1, scale: 1}}
                                className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-[#F2B82E]/30 transition-all duration-500"
                            >
                                {/* Visual Header */}
                                <div className="h-56 relative bg-black overflow-hidden">
                                    <img src={item.images[0]} alt={item.title}
                                    className={`w-full h-full object-cover transition-all duration-700 ${ item.status === 'Available' ? 'opacity-40 group-hover:opacity-80' : 'grayscale opacity-10'}`}
                                    />
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <span className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-1 5 rounded-xl text-[8px] font-black uppercase tracking-widest text-white/60"> { item.category } 
                                        </span>
                                        <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${
                                        item.status === 'Available' 
                                        ? 'bg-[#F2B82E]/10 border-[#F2B82E]/20 text-[#F2B82E]' 
                                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Technical Specs */}
                                <div className="p-8 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight leading-none mb-2 group-hover:text-[#F2B82E] transition-colors">
                                    {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs font-medium line-clamp-1">{item.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                                    <div>
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Daily Rate</p>
                                    <p className="text-xl font-black italic text-white">₹{item.pricePerDay}</p>
                                    </div>
                                    <div>
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Security</p>
                                    <p className="text-xl font-black italic text-white">₹{item.securityDeposit}</p>
                                    </div>
                                </div>

                                {/* Operational Controls */}
                                <div className="flex items-center gap-2">
                                    <button className="flex-1 bg-white/[0.03] hover:bg-white/10 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2" 
                                    onClick={() => handleUpdateStatus(item._id,item.status === 'Available' ? 'Hidden' : 'Available')}>
                                    {item.status === 'Available' ? <><EyeOff size={14} /> Decommission</> : <><Eye size={14} /> Deploy</>}
                                    </button>
                                    <button className="p-4 bg-white/[0.03] hover:bg-white/10 text-white/40 hover:text-[#F2B82E] rounded-2xl transition-all">
                                    <Edit3 size={16} />
                                    </button>
                                    <button className="p-4 bg-white/[0.03] hover:bg-red-500/10 text-white/40 hover:text-red-500 rounded-2xl transition-all" onClick={ () => handleDelete(item._id)}>
                                    <Trash2 size={16} />
                                    </button>
                                </div>
                                </div>

                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* New Asset Placeholder */}
                    <motion.div 
                        onClick={() => navigate('/lend')}
                        className="border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group hover:border-[#F2B82E]/20 hover:bg-[#F2B82E]/5 cursor-pointer transition-all duration-500"
                    >
                        <div className="w-16 h-16 bg-white/[0.03] rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Plus className="text-white/20 group-hover:text-[#F2B82E]" size={32} />
                        </div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                        Initialize New Asset Slot
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default AssetManager;