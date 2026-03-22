import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send, X, MessageCircle, Clock } from 'lucide-react';

// Connect to your Node.js backend
const socket = io.connect('http://localhost:3000');

const ChatDrawer = ({ itemId, itemName, currentUser, isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  // 1. Join the Room & Setup Listeners
  useEffect(() => {
    if (isOpen) {
      // Join the specific item room on the backend
      socket.emit('join_chat', itemId);

      // Listen for incoming messages
      socket.on('receive_msg', (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }

    // Cleanup when the chat closes
    return () => {
      socket.off('receive_msg');
    };
  }, [itemId, isOpen]);

  // 2. Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message Logic
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const msgData = {
        itemId,
        sender: currentUser.name,
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Emit to server
      socket.emit('send_msg', msgData);
      
      // Add to local state immediately (Optimistic UI)
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 md:right-10 w-full md:w-[400px] h-[500px] bg-[#0F1A2C] border-x border-t border-white/10 rounded-t-[2.5rem] shadow-2xl z-50 flex flex-col animate-slide-up">
      
      {/* Header */}
      <div className="p-6 bg-[#1C2E4A] flex justify-between items-center rounded-t-[2.5rem] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F2B82E]/10 rounded-xl text-[#F2B82E]">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="text-white font-black text-sm">{itemName}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Live Negotiation</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
            <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm font-medium ${
              msg.sender === currentUser.name 
                ? 'bg-[#F2B82E] text-[#1C2E4A] rounded-tr-none shadow-lg shadow-[#F2B82E]/10' 
                : 'bg-white/5 text-white border border-white/10 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500 font-bold uppercase">
              <Clock size={10} />
              {msg.timestamp}
            </div>
            <div ref={scrollRef} />
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-6 bg-[#1C2E4A] border-t border-white/5">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about pickup location..."
            className="w-full bg-[#0F1A2C] border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white placeholder-gray-500 focus:border-[#F2B82E] outline-none transition-all"
          />
          <button 
            onClick={handleSendMessage}
            className="absolute right-2 p-3 bg-[#F2B82E] text-[#1C2E4A] rounded-xl hover:scale-105 transition-transform shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;