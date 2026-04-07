import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Loader2, Fingerprint } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`https://rental-app-1-zfws.onrender.com/api/auth/login`, formData);

      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/'); // Navigation to neutral route
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-8 py-12 relative overflow-hidden">
      
      {/* Structural Background Details */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F2B82E]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/[0.03] border border-white/10 rounded-3xl mb-8 backdrop-blur-xl">
            <Fingerprint className="text-[#F2B82E]" size={38} strokeWidth={1.5} />
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            Access <br /> <span className="text-white/20 italic font-light">Protocol.</span>
          </h2>
          <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.4em]">Identity Verification Required</p>
        </div>

        {/* The Card */}
        <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative">
          
          {error && (
            <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
              System Error: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#F2B82E] transition-colors" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="name@institution.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-white/10 focus:border-[#F2B82E]/50 focus:bg-white/[0.05] outline-none transition-all duration-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Secret Key</label>
                <Link to="/forgot-password" size={20} className="text-[9px] font-black text-[#F2B82E]/50 hover:text-[#F2B82E] uppercase tracking-widest transition-colors">
                  Recover
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#F2B82E] transition-colors" size={18} />
                <input 
                  type="password" 
                  name="password" 
                  required 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-white/10 focus:border-[#F2B82E]/50 focus:bg-white/[0.05] outline-none transition-all duration-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#F2B82E] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(242,184,46,0.1)] hover:bg-white group"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  Initialize Session
                  <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
              New to the engine? 
              <Link to="/signup" className="text-white ml-2 hover:text-[#F2B82E] transition-colors">Create Identity</Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex justify-center items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
          <span className="flex h-1.5 w-1.5 rounded-full bg-green-500/50 animate-pulse"></span>
          Vault Encryption Active
        </div>
      </div>
    </div>
  );
};

export default Login;