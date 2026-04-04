import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Building2, Home, ArrowRight, Loader2, Fingerprint, KeyRound, ShieldCheck } from 'lucide-react';
import home2 from './Home2';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: 'GLBITM',
    hostel: 'Bose House',
    roomNumber: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSendOtp = async () => {
    // Basic verification check
    if (!formData.email.toLowerCase().includes('@')) {
      setError("Please enter a valid institutional identifier.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://rental-app-1-zfws.onrender.com/api/auth/generate-otp', { email: formData.email });
      setOtpSent(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Protocol Error: Failed to transmit OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://rental-app-1-zfws.onrender.com/api/auth/signup', formData);
      if (response.status === 201) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/home2');
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification Failed: Check Secret Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-8 py-12 relative overflow-hidden">
      
      {/* Background Brand Details */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F2B82E]/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Step-Aware Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/[0.03] border border-white/10 rounded-3xl mb-8 backdrop-blur-xl">
            {otpSent ? (
              <ShieldCheck className="text-[#F2B82E]" size={38} strokeWidth={1.5} />
            ) : (
              <Fingerprint className="text-[#F2B82E]" size={38} strokeWidth={1.5} />
            )}
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            {otpSent ? "Verify" : "Create"} <br /> <span className="text-white/20 italic font-light">Identity.</span>
          </h2>
          <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.4em]">
            {otpSent ? `Code Transmitted to ${formData.email.split('@')[0]}...` : "Initialize Student Protocol"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
          
          {error && (
            <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          {!otpSent ? (
            /* --- STEP 1: Email Collection --- */
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Institutional Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#F2B82E] transition-colors" size={18} />
                  <input 
                    type="email" name="email" required placeholder="name@institution.com"
                    value={formData.email} onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-white/10 focus:border-[#F2B82E]/50 outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleSendOtp}
                disabled={loading || !formData.email}
                className="w-full bg-[#F2B82E] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(242,184,46,0.1)] hover:bg-white disabled:opacity-30 group"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    Transmit Code
                    <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* --- STEP 2: Full Profile Creation --- */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* OTP Field (High Contrast) */}
              <div className="relative group mb-8">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F2B82E]" size={18} />
                <input 
                  type="text" name="otp" required placeholder="SECRET KEY"
                  value={formData.otp} onChange={handleChange}
                  className="w-full bg-[#F2B82E]/5 border border-[#F2B82E]/30 rounded-2xl py-5 pl-14 pr-6 text-white font-mono tracking-[0.5em] text-center focus:border-[#F2B82E] outline-none"
                />
              </div>

              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input type="text" name="name" required placeholder="FULL NAME" value={formData.name} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 text-white text-xs font-bold tracking-widest placeholder-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <select name="hostel" value={formData.hostel} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-[10px] font-black uppercase tracking-widest outline-none appearance-none">
                    <option>Bose House</option>
                    <option>Tagore House</option>
                    <option>Sarojini House</option>
                  </select>
                </div>
                <input type="text" name="roomNumber" required placeholder="ROOM" value={formData.roomNumber} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white text-[10px] font-black tracking-widest placeholder-white/10" />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input type="password" name="password" required placeholder="CREATE PASSWORD" value={formData.password} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 text-white placeholder-white/10" />
              </div>

              <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-[#F2B82E] shadow-xl flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : "Authorize Identity"}
              </button>
              
              <button type="button" onClick={() => setOtpSent(false)} className="w-full text-white/20 text-[9px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">
                Modify Identifier
              </button>
            </form>
          )}

          {/* Social Footer */}
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
              Existing Protocol? 
              <Link to="/login" className="text-white ml-2 hover:text-[#F2B82E] transition-colors">Authenticate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;