import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, X, Cpu, MessageSquare, Wifi } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Added timestamps to message state
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'CampusAI Activated. State your query regarding the CampusLink.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: currentTime }]);
    setIsLoading(true);

    try {
      // console.log("Sending user query to backend:", userText);
      const BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
      const response = await axios.post(`${BASE_URL}/api/ask`, { message: userText } , { timeout: 10000 });
      // console.log("Received response from backend:", response.data);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply, time: replyTime }]);
    } catch (error) {
      // console.log(error.response?.data?.message || error.message);
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { sender: 'bot', text: 'ERR: Neural link severed. Connection timeout.', time: errorTime }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans antialiased">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-24 right-0 w-[400px] h-[650px] bg-[#050505]/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-white/10"
          >
            {/* Background Grid Scanline */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
                 style={{ backgroundImage: `linear-gradient(transparent 50%, rgba(255,255,255,1) 50%)`, backgroundSize: '100% 4px' }}></div>

            {/* Header Module */}
            <div className="bg-[#0a0a0a]/80 px-8 py-6 flex justify-between items-center border-b border-white/5 z-10 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border border-dashed border-[#F2B82E]/30 rounded-2xl"
                    />
                    <Cpu className="text-[#F2B82E] relative z-10" size={20} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#F2B82E] rounded-full animate-pulse shadow-[0_0_12px_#F2B82E] border-2 border-[#0a0a0a]"></div>
                </div>
                <div>
                  <h2 className="font-black text-white uppercase tracking-[0.2em] text-xs leading-none">CampusAI</h2>
                  <div className="flex items-center gap-2 mt-2 text-[#F2B82E]">
                    <Wifi size={10} className="animate-pulse" />
                    <p className="text-[8px] font-mono tracking-[0.3em] uppercase">Uplink: 12ms</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/30 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Message Feed */}
            <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-8 relative scrollbar-hide">
              {messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} relative z-10 w-full`}
                >
                  <div className={`flex ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3 max-w-[85%]`}>
                    
                    {/* Bot Icon */}
                    {msg.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex-shrink-0 flex items-center justify-center mb-1">
                        <Terminal className="text-white/40" size={12} />
                      </div>
                    )}
                    
                    {/* Chat Bubble */}
                    <div 
                      className={`px-5 py-4 text-[13px] leading-relaxed tracking-wide ${
                        msg.sender === 'user' 
                          ? 'bg-[#F2B82E] text-black font-bold rounded-3xl rounded-br-sm shadow-[0_10px_25px_rgba(242,184,46,0.2)]' 
                          : 'bg-white/[0.03] border border-white/5 text-gray-300 rounded-3xl rounded-bl-sm font-light border-l-2 border-l-[#F2B82E]/50'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <span className={`text-[8px] font-mono text-white/20 uppercase tracking-widest mt-2 ${msg.sender === 'user' ? 'mr-12' : 'ml-12'}`}>
                    {msg.time}
                  </span>
                </motion.div>
              ))}
              
              {/* Terminal Loading State */}
              {isLoading && (
                <div className="flex justify-start relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex-shrink-0 flex items-center justify-center mr-3">
                    <Terminal className="text-[#F2B82E]" size={12} />
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 px-5 py-4 rounded-3xl rounded-bl-sm border-l-2 border-l-[#F2B82E] flex items-center gap-2 text-[#F2B82E] font-mono text-[9px] uppercase tracking-widest">
                    <span>Processing_Query</span>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Module */}
            <div className="bg-[#0a0a0a]/80 p-5 z-10 border-t border-white/5 backdrop-blur-md">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Initialize command sequence..."
                  className="w-full pl-6 pr-16 py-5 bg-white/[0.02] border border-white/10 rounded-2xl outline-none text-[12px] text-white placeholder-white/20 focus:border-[#F2B82E]/50 focus:bg-white/[0.05] transition-all font-mono tracking-wide"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#F2B82E] text-black rounded-xl hover:bg-white transition-all disabled:bg-white/5 disabled:text-white/20 flex items-center justify-center group"
                >
                  <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Trigger Button --- */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_10px_40px_rgba(242,184,46,0.3)] transition-all duration-500 border relative overflow-hidden ${
          isOpen 
          ? 'bg-[#0a0a0a] text-white/50 border-white/10 hover:text-white' 
          : 'bg-[#F2B82E] text-black border-[#F2B82E] hover:bg-white'
        }`}
      >
        {/* Subtle spinning glow when closed */}
        {!isOpen && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-50"
          />
        )}
        <div className="relative z-10">
          {isOpen ? <X size={24} strokeWidth={2.5} /> : <MessageSquare size={24} fill="currentColor" />}
        </div>
      </motion.button>

    </div>
  );
};

export default ChatWidget;
