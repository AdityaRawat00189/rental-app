import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Zap, Info, ShieldCheck, Camera, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import LoadingScreen from '../components/LoadingScreen';

const LendItem = () => {
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    securityDeposit: '',
    category: 'Essentials',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading , setLoading] = useState(false);
  
  const Navigate = useNavigate();  
  useEffect(() => {
    if(!localStorage.getItem('user')) {
      Navigate('/login');
    }
  },[Navigate]);
  
  const handleUpload = async () => {
    const user = localStorage.getItem('user');
    if(!user) {
      Navigate('/login');
    }

    if(images.length === 0 ){
      alert("Please upload at least one image of the asset.");
      return;
    }
    // Logic to upload item details and images to backend
    try {
      setLoading(true);

      const token = JSON.parse(user).token;
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('pricePerDay', formData.pricePerDay);
      data.append('securityDeposit', formData.securityDeposit);
      data.append('category', formData.category);

      images.forEach((file) => {
        data.append('images', file);
      });

      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const res = await axios.post(`${BASE_URL}/api/item/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 201) {
        alert("Success! Your item is live at GLBITM.");
        Navigate('/home2');
      }

    } catch (error) {
      console.error("Error uploading item:", error);
      alert(error.response?.data?.message || "Internal Server Error");
    }finally {
      setLoading(false);
    }
    
  }


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("System Limit: Maximum 5 assets allowed per deployment.");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    
    // Generate Previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  return (
    <>
    {loading && <LoadingScreen/> }

    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Module */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#F2B82E] animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">New Deployment</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            Lend <span className="text-white/20 italic font-light">Asset.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Data Entry (7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Image Upload Terminal */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Visual Documentation (Max 5)</label>
              <div className="grid grid-cols-3 gap-4">
                <AnimatePresence>
                  {previews.map((src, index) => (
                    <motion.div 
                      key={src}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative h-24 rounded-2xl overflow-hidden border border-white/10 group"
                    >
                      <img src={src} alt="preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <button 
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {previews.length < 5 && (
                  <label className="h-24 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-[#F2B82E]/50 transition-all group">
                    <Plus size={20} className="text-white/20 group-hover:text-[#F2B82E]" />
                    <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Asset Designation</label>
                <input 
                  type="text" placeholder="e.g. Digital Oscilloscope X200"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-white focus:border-[#F2B82E]/50 outline-none transition-all"
                  onChange={(e)=>setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Technical Description</label>
                <textarea 
                  rows="4"
                  placeholder="Specify condition, accessories, and usage constraints..."
                  className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 px-6 text-white focus:border-[#F2B82E]/50 outline-none transition-all resize-none"
                  onChange={(e)=>setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Daily Exchange (₹)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-white focus:border-[#F2B82E]/50 outline-none"
                  onChange={(e)=>setFormData({...formData, pricePerDay: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Security Deposit (₹)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-white focus:border-[#F2B82E]/50 outline-none"
                  onChange={(e)=>setFormData({...formData, securityDeposit: e.target.value})}
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Configuration & Deploy (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Sector Category</label>
                <select className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-5 px-6 text-white text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer hover:border-[#F2B82E]/30 transition-all">
                  <option>Technical Tools</option>
                  <option>Academic Assets</option>
                  <option>Hardware</option>
                  <option>Scientific Gear</option>
                  <option>Infrastructure</option>
                </select>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex items-start gap-4 mb-8">
                  <ShieldCheck size={20} className="text-[#F2B82E] shrink-0" />
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                    By deploying this asset, you confirm it is in operational condition and adheres to the Institutional Sharing Protocol.
                  </p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "#fff" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#F2B82E] text-black py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-[0_20px_40px_rgba(242,184,46,0.1)]"
                  onClick={handleUpload}
                >
                  Authorize Deployment
                  <Zap size={18} fill="currentColor" />
                </motion.button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="p-8 border border-white/5 rounded-[2.5rem] flex items-center gap-4 text-white/20">
              <Info size={20} />
              <p className="text-[9px] font-black uppercase tracking-[0.2em]">Deployment logic: Assets are visible to verified peers instantly upon authorization.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};
export default LendItem;