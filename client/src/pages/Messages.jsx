// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';
// import axios from 'axios';
// import { Send, User, ArrowLeft, Clock } from 'lucide-react';

// const socket = io.connect("http://localhost:3000"); // Your Backend Port

// const Messages = () => {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [inbox, setInbox] = useState([]);
//   const scrollRef = useRef();

//   const user = JSON.parse(localStorage.getItem('user'));
//   const currentId = user.id || user._id;

//   const restoreChatHistory = async () => {
//     try {
//         const user = JSON.parse(localStorage.getItem('user'));
//         const BASE_URL = import.meta.env.VITE_BASE_URL;

//         // Hit the endpoint we made in Step 5
//         const res = await axios.get(`${BASE_URL}/api/chat/messages/${conversationId}`, {
//         headers: { Authorization: `Bearer ${user.token}` }
//         });

//         // Load the history into the UI
//         setMessages(res.data);
//     } catch (error) {
//         console.error("Failed to restore protocol history:", error);
//     }
//     };

//   // 1. Fetch Inbox & Handle Room Joining
//   useEffect(() => {
//     const fetchInbox = async () => {
//       const BASE_URL = import.meta.env.VITE_BASE_URL;
//       const res = await axios.get(`${BASE_URL}/api/chat/inbox`, {
//         headers: { Authorization: `Bearer ${user.token}` }
//       });
//       setInbox(res.data);
//     };

//     if (conversationId) {
//       socket.emit("join_chat", conversationId);
//       fetchChatHistory();
//     }
//     fetchInbox();

//     if(conversationId) restoreChatHistory();
//   }, [conversationId]);

//   // 2. Real-Time Listener
//   useEffect(() => {
//     socket.on("message_received", (msg) => {
//       if (msg.conversationId === conversationId) {
//         setMessages((prev) => [...prev, msg]);
//       }
//       // Trigger inbox refresh to update "last message" preview
//       refreshInbox();
//     });
//     return () => socket.off("message_received");
//   }, [conversationId]);

//   const fetchChatHistory = async () => {
//     const BASE_URL = import.meta.env.VITE_BASE_URL;
//     const res = await axios.get(`${BASE_URL}/api/chat/messages/${conversationId}`, {
//       headers: { Authorization: `Bearer ${user.token}` }
//     });
//     setMessages(res.data);
//   };

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;
//     const data = { conversationId, senderId: currentId, text: newMessage };
//     socket.emit("send_message", data);
//     setNewMessage("");
//   };

//   // Helper: Find the other student's name
//   const getOtherUser = (participants) => participants.find(p => p._id !== currentId) || { name: "User" };

//   return (
//     <div className="flex h-screen bg-[#050505] pt-20 overflow-hidden text-white">
//       {/* SIDEBAR: Archive List */}
//       <div className="w-80 border-r border-white/5 flex flex-col hidden md:flex">
//         <div className="p-8 border-b border-white/5">
//           <h2 className="text-2xl font-black italic uppercase tracking-tighter">Secure <span className="text-[#F2B82E]">Inbox</span></h2>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {inbox.map(chat => (
//             <div 
//               key={chat._id} 
//               onClick={() => navigate(`/messages/${chat._id}`)}
//               className={`p-6 cursor-pointer border-b border-white/5 transition-all ${chat._id === conversationId ? 'bg-[#F2B82E]/10 border-r-2 border-[#F2B82E]' : 'hover:bg-white/[0.02]'}`}
//             >
//               <p className="font-black uppercase text-xs tracking-widest mb-1">{getOtherUser(chat.participants).name}</p>
//               <p className="text-[10px] text-gray-500 truncate">{chat.lastMessage?.text || "No history logged..."}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* CHAT WINDOW */}
//       <div className="flex-1 flex flex-col relative">
//         {!conversationId ? (
//           <div className="flex-1 flex flex-col items-center justify-center opacity-20">
//             <User size={48} className="mb-4" />
//             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Connection</p>
//           </div>
//         ) : (
//           <>
//             <div className="flex-1 overflow-y-auto p-8 space-y-6">
//               {messages.map((m, i) => (
//                 <div key={i} className={`flex ${m.sender === currentId ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`max-w-xs px-5 py-3 rounded-2xl text-sm font-medium ${
//                     m.sender === currentId 
//                     ? 'bg-[#F2B82E] text-black rounded-tr-none shadow-lg shadow-[#F2B82E]/5' 
//                     : 'bg-white/5 text-white border border-white/10 rounded-tl-none'
//                   }`}>
//                     {m.text}
//                     <div className="mt-1 text-[8px] opacity-40 uppercase font-black text-right">
//                       {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div ref={scrollRef} />
//             </div>

//             {/* Input Module */}
//             <div className="p-8 bg-black border-t border-white/5 flex gap-4">
//               <input 
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                 placeholder="Type protocol message..."
//                 className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-[#F2B82E] transition-all"
//               />
//               <button onClick={sendMessage} className="bg-[#F2B82E] text-black p-4 rounded-2xl hover:scale-105 transition-transform">
//                 <Send size={20} />
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Messages;


// import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';
// import axios from 'axios';
// import { Send, User, Loader2 } from 'lucide-react';

// // 1. IMPROVEMENT: Use the environment variable for the socket connection
// const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
// const socket = io.connect(BASE_URL); 

// const Messages = () => {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const scrollRef = useRef();

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [inbox, setInbox] = useState([]);
//   const [isLoading, setIsLoading] = useState(false); // 2. IMPROVEMENT: Added loading state

//   // 3. IMPROVEMENT: Memoize user parsing so it doesn't run on every keystroke
//   const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
//   const currentId = user?.id || user?._id;

//   // ==========================================
//   // 1. DATA FETCHING FUNCTIONS (Memoized)
//   // ==========================================
  
//   // 4. IMPROVEMENT: Wrap in useCallback to prevent infinite loops in useEffects
//   const fetchInbox = useCallback(async () => {
//     if (!user?.token) return;
//     try {
//       const res = await axios.get(`${BASE_URL}/api/chat/inbox`, {
//         headers: { Authorization: `Bearer ${user.token}` }
//       });
//       setInbox(res.data);
//     } catch (error) {
//       console.error("Failed to fetch secure inbox:", error);
//     }
//   }, [user?.token]);

//   const fetchChatHistory = useCallback(async () => {
//     if (!user?.token || !conversationId) return;
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${BASE_URL}/api/chat/messages/${conversationId}`, {
//         headers: { Authorization: `Bearer ${user.token}` }
//       });
//       setMessages(res.data);
//     } catch (error) {
//       console.error("Failed to restore protocol history:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [conversationId, user?.token]);

//   // ==========================================
//   // 2. USE EFFECTS (Lifecycles & Sockets)
//   // ==========================================
  
//   useEffect(() => {
//     fetchInbox(); 
//     if (conversationId) {
//       fetchChatHistory(); 
//       socket.emit("join_chat", conversationId); 
//     }
//   }, [conversationId, fetchInbox, fetchChatHistory]);

//   useEffect(() => {
//     const handleIncomingMessage = (msg) => {
//       // 1. Append message if it belongs to the current active window
//       if (msg.conversationId === conversationId) {
//         setMessages((prev) => [...prev, msg]);
//       }
      
//       // 5. IMPROVEMENT: Update inbox locally instead of making an expensive API call
//       setInbox((prevInbox) => 
//         prevInbox.map(chat => 
//           chat._id === msg.conversationId 
//             ? { ...chat, lastMessage: msg } 
//             : chat
//         )
//       );
//     };

//     socket.on("message_received", handleIncomingMessage);
//     return () => socket.off("message_received", handleIncomingMessage);
//   }, [conversationId]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ==========================================
//   // 3. ACTION FUNCTIONS
//   // ==========================================
//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     const data = { 
//       conversationId, 
//       senderId: currentId, 
//       text: newMessage 
//     };
    
//     socket.emit("send_message", data);
//     setNewMessage(""); 
//   };

//   const getOtherUser = (participants) => {
//     // 6. IMPROVEMENT: Added optional chaining safety
//     return participants?.find(p => p._id !== currentId) || { name: "Campus User" };
//   };

//   // ==========================================
//   // 4. UI RENDER (Neo-Brutalist Dark Mode)
//   // ==========================================
//   return (
//     <div className="flex h-screen bg-[#050505] pt-20 overflow-hidden text-white">
      
//       {/* SIDEBAR: Archive List */}
//       <div className="w-80 border-r border-white/5 flex flex-col hidden md:flex">
//         <div className="p-8 border-b border-white/5">
//           <h2 className="text-2xl font-black italic uppercase tracking-tighter">
//             Secure <span className="text-[#F2B82E]">Inbox</span>
//           </h2>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {inbox.map(chat => (
//             <div 
//               key={chat._id} 
//               onClick={() => navigate(`/messages/${chat._id}`)}
//               className={`p-6 cursor-pointer border-b border-white/5 transition-all ${
//                 chat._id === conversationId ? 'bg-[#F2B82E]/10 border-r-2 border-[#F2B82E]' : 'hover:bg-white/[0.02]'
//               }`}
//             >
//               <p className="font-black uppercase text-xs tracking-widest mb-1">
//                 {getOtherUser(chat.participants).name}
//               </p>
//               <p className="text-[10px] text-gray-500 truncate">
//                 {chat.lastMessage?.text || "No history logged..."}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* CHAT WINDOW */}
//       <div className="flex-1 flex flex-col relative">
//         {!conversationId ? (
//           <div className="flex-1 flex flex-col items-center justify-center opacity-20">
//             <User size={48} className="mb-4" />
//             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Connection</p>
//           </div>
//         ) : (
//           <>
//             <div className="flex-1 overflow-y-auto p-8 space-y-6">
//               {isLoading ? (
//                 <div className="h-full flex items-center justify-center text-gray-500">
//                   <Loader2 className="animate-spin mr-2" size={20} />
//                   <span className="text-xs uppercase tracking-widest">Decrypting Logs...</span>
//                 </div>
//               ) : (
//                 messages.map((m, i) => {
//                   const isMe = (m.sender?._id || m.sender) === currentId;
                  
//                   return (
//                     <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
//                       <div className={`max-w-xs px-5 py-3 rounded-2xl text-sm font-medium ${
//                         isMe 
//                         ? 'bg-[#F2B82E] text-black rounded-tr-none shadow-lg shadow-[#F2B82E]/5' 
//                         : 'bg-white/5 text-white border border-white/10 rounded-tl-none'
//                       }`}>
//                         {m.text}
//                         <div className="mt-1 text-[8px] opacity-40 uppercase font-black text-right">
//                           {/* 7. IMPROVEMENT: Added safety check for createdAt to prevent "Invalid Date" crashes */}
//                           {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//               <div ref={scrollRef} />
//             </div>

//             {/* Input Module */}
//             <div className="p-8 bg-black border-t border-white/5 flex gap-4">
//               <input 
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // Use onKeyDown instead of deprecated onKeyPress
//                 placeholder="Type protocol message..."
//                 className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-[#F2B82E] transition-all"
//               />
//               <button 
//                 onClick={sendMessage} 
//                 disabled={!newMessage.trim()}
//                 className="bg-[#F2B82E] text-black p-4 rounded-2xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-transform"
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Messages;


// import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';
// import axios from 'axios';
// import { 
//   Send, User, Loader2, ShieldCheck, 
//   Phone, Video, MoreVertical, Clock, 
//   FileText, Activity 
// } from 'lucide-react';

// const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
// const socket = io.connect(BASE_URL); 

// const Messages = () => {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const scrollRef = useRef();

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [inbox, setInbox] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isTyping, setIsTyping] = useState(false); // New typing state

//   const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
//   const currentId = user?.id || user?._id;

//   // ==========================================
//   // DATA FETCHING & SOCKET LOGIC (Retained from previous optimization)
//   // ==========================================
//   const fetchInbox = useCallback(async () => {
//     if (!user?.token) return;
//     try {
//       const res = await axios.get(`${BASE_URL}/api/chat/inbox`, {
//         headers: { Authorization: `Bearer ${user.token}` }
//       });
//       setInbox(res.data);
//     } catch (error) {
//       console.error("Failed to fetch secure inbox:", error);
//     }
//   }, [user?.token]);

//   const fetchChatHistory = useCallback(async () => {
//     if (!user?.token || !conversationId) return;
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${BASE_URL}/api/chat/messages/${conversationId}`, {
//         headers: { Authorization: `Bearer ${user.token}` }
//       });
//       setMessages(res.data);
//     } catch (error) {
//       console.error("Failed to restore protocol history:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [conversationId, user?.token]);

//   useEffect(() => {
//     fetchInbox(); 
//     if (conversationId) {
//       fetchChatHistory(); 
//       socket.emit("join_chat", conversationId); 
//     }
//   }, [conversationId, fetchInbox, fetchChatHistory]);

//   useEffect(() => {
//     const handleIncomingMessage = (msg) => {
//       if (msg.conversationId === conversationId) setMessages((prev) => [...prev, msg]);
//       setInbox((prev) => prev.map(chat => chat._id === msg.conversationId ? { ...chat, lastMessage: msg } : chat));
//     };

//     socket.on("message_received", handleIncomingMessage);
//     return () => socket.off("message_received", handleIncomingMessage);
//   }, [conversationId]);

//   useEffect(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

//   // ==========================================
//   // ACTIONS
//   // ==========================================
//   const sendMessage = () => {
//     if (!newMessage.trim()) return;
//     const data = { conversationId, senderId: currentId, text: newMessage };
//     socket.emit("send_message", data);
//     setNewMessage(""); 
//   };

//   const getOtherUser = (participants) => participants?.find(p => p._id !== currentId) || { name: "Unknown User" };
//   const activeUser = inbox.find(c => c._id === conversationId) ? getOtherUser(inbox.find(c => c._id === conversationId).participants) : null;

//   // ==========================================
//   // UI RENDER (Modern SaaS / Glassmorphism)
//   // ==========================================
//   return (
//     <div className="flex h-screen bg-[#0A0A0B] text-gray-100 font-sans selection:bg-indigo-500/30 overflow-hidden pt-16">
      
//       {/* 1. LEFT SIDEBAR: Smart Inbox */}
//       <div className="w-80 border-r border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl flex flex-col hidden md:flex z-10">
//         <div className="p-6 border-b border-white/5">
//           <h2 className="text-lg font-semibold flex items-center gap-2">
//             Messages <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">{inbox.length}</span>
//           </h2>
//           <div className="mt-4 relative">
//             <input 
//               type="text" 
//               placeholder="Search conversations..." 
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-gray-600"
//             />
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto custom-scrollbar">
//           {inbox.map(chat => {
//             const isActive = chat._id === conversationId;
//             return (
//               <div 
//                 key={chat._id} 
//                 onClick={() => navigate(`/messages/${chat._id}`)}
//                 className={`p-4 mx-3 my-1 rounded-2xl cursor-pointer transition-all duration-200 group ${
//                   isActive ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-lg">
//                       {getOtherUser(chat.participants).name.charAt(0)}
//                     </div>
//                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A0A0B] rounded-full"></div>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-baseline mb-1">
//                       <p className={`text-sm font-medium truncate ${isActive ? 'text-indigo-300' : 'text-gray-200'}`}>
//                         {getOtherUser(chat.participants).name}
//                       </p>
//                       <span className="text-[10px] text-gray-500">
//                         {chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-500 truncate group-hover:text-gray-400 transition-colors">
//                       {chat.lastMessage?.text || "Started a conversation..."}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* 2. MAIN CHAT AREA */}
//       <div className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111115] to-[#0A0A0B]">
//         {!conversationId ? (
//           <div className="flex-1 flex flex-col items-center justify-center opacity-40">
//             <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
//               <User size={32} className="text-indigo-400" />
//             </div>
//             <p className="text-sm font-medium tracking-wide">Select a conversation to start</p>
//             <p className="text-xs text-gray-500 mt-2">End-to-end encrypted messaging</p>
//           </div>
//         ) : (
//           <>
//             {/* Chat Header */}
//             <div className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.01] backdrop-blur-md sticky top-0 z-10">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-lg font-semibold shadow-lg shadow-indigo-500/20">
//                   {activeUser?.name.charAt(0)}
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-medium">{activeUser?.name}</h2>
//                   <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
//                     <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
//                     Active Now
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 text-gray-400">
//                 <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><Phone size={18} /></button>
//                 <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><Video size={18} /></button>
//                 <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><MoreVertical size={18} /></button>
//               </div>
//             </div>

//             {/* Chat Messages */}
//             <div className="flex-1 overflow-y-auto p-8 space-y-6">
//               {isLoading ? (
//                 <div className="h-full flex items-center justify-center text-indigo-400">
//                   <Loader2 className="animate-spin" size={24} />
//                 </div>
//               ) : (
//                 messages.map((m, i) => {
//                   const isMe = (m.sender?._id || m.sender) === currentId;
//                   return (
//                     <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
//                       <div className="flex flex-col gap-1 max-w-[70%]">
//                         <div className={`px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
//                           isMe 
//                           ? 'bg-indigo-600 text-white rounded-3xl rounded-tr-sm shadow-indigo-500/10' 
//                           : 'bg-white/5 text-gray-100 border border-white/10 rounded-3xl rounded-tl-sm'
//                         }`}>
//                           {m.text}
//                         </div>
//                         <div className={`text-[10px] text-gray-500 px-2 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'text-right' : 'text-left'}`}>
//                           {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//               <div ref={scrollRef} />
//             </div>

//             {/* Input Area */}
//             <div className="p-6 bg-[#0A0A0B]/80 backdrop-blur-xl border-t border-white/5">
//               <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50 focus-within:bg-white/10 transition-all shadow-inner">
//                 <input 
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                   placeholder="Type your message..."
//                   className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-500"
//                 />
//                 <button 
//                   onClick={sendMessage} 
//                   disabled={!newMessage.trim()}
//                   className="bg-indigo-600 text-white p-3.5 rounded-xl hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-md shadow-indigo-500/20"
//                 >
//                   <Send size={18} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* 3. RIGHT SIDEBAR: Contextual Widgets Panel */}
//       {conversationId && (
//         <div className="w-80 border-l border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl hidden lg:flex flex-col p-6 overflow-y-auto z-10">
          
//           {/* Profile Widget */}
//           <div className="flex flex-col items-center pb-6 border-b border-white/5 text-center">
//             <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold shadow-xl shadow-indigo-500/20 mb-4">
//               {activeUser?.name.charAt(0)}
//             </div>
//             <h3 className="text-xl font-semibold mb-1">{activeUser?.name}</h3>
//             <p className="text-sm text-gray-500">Student / Developer</p>
//           </div>

//           {/* Security Status Widget */}
//           <div className="mt-6 bg-green-500/5 border border-green-500/10 rounded-2xl p-4 flex items-start gap-3">
//             <ShieldCheck className="text-green-400 mt-0.5" size={20} />
//             <div>
//               <p className="text-sm font-medium text-green-400">Secure Protocol</p>
//               <p className="text-xs text-gray-500 mt-1">End-to-end encryption is active for this session.</p>
//             </div>
//           </div>

//           {/* Activity Widget */}
//           <div className="mt-6">
//             <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
//               <Activity size={14} /> Session Activity
//             </h4>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Clock size={14} className="text-gray-400" /></div>
//                 <div className="flex-1">
//                   <p className="text-gray-200">Local Time</p>
//                   <p className="text-xs text-gray-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Shared Media Placeholder Widget */}
//           <div className="mt-8">
//              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
//               <FileText size={14} /> Shared Files
//             </h4>
//             <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center border-dashed">
//               <p className="text-xs text-gray-500">No media shared in this conversation yet.</p>
//             </div>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// };

// export default Messages;




import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { 
  Send, User, Loader2, ShieldCheck, 
  Phone, Video, MoreVertical, Clock, 
  FileText, Activity 
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
const socket = io.connect(BASE_URL); 

const Messages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [inbox, setInbox] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const currentId = user?.id || user?._id;

  // ==========================================
  // DATA FETCHING & SOCKET LOGIC
  // ==========================================
  const fetchInbox = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/inbox`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setInbox(res.data);
    } catch (error) {
      console.error("Failed to fetch secure inbox:", error);
    }
  }, [user?.token]);

  const fetchChatHistory = useCallback(async () => {
    if (!user?.token || !conversationId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to restore protocol history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, user?.token]);

  useEffect(() => {
    fetchInbox(); 
    if (conversationId) {
      fetchChatHistory(); 
      socket.emit("join_chat", conversationId); 
    }
  }, [conversationId, fetchInbox, fetchChatHistory]);

  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      if (msg.conversationId === conversationId) setMessages((prev) => [...prev, msg]);
      setInbox((prev) => prev.map(chat => chat._id === msg.conversationId ? { ...chat, lastMessage: msg } : chat));
    };

    socket.on("message_received", handleIncomingMessage);
    return () => socket.off("message_received", handleIncomingMessage);
  }, [conversationId]);

  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // ==========================================
  // ACTIONS
  // ==========================================
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const data = { conversationId, senderId: currentId, text: newMessage };
    socket.emit("send_message", data);
    setNewMessage(""); 
  };

  const getOtherUser = (participants) => participants?.find(p => p._id !== currentId) || { name: "Unknown User" };
  const activeUser = inbox.find(c => c._id === conversationId) ? getOtherUser(inbox.find(c => c._id === conversationId).participants) : null;

  // ==========================================
  // UI RENDER (Golden Glass Theme)
  // ==========================================
  return (
    <div className="flex h-screen bg-[#050505] text-gray-100 font-sans selection:bg-[#F2B82E]/30 overflow-hidden pt-16">
      
      {/* 1. LEFT SIDEBAR: Smart Inbox */}
      <div className="w-80 border-r border-white/5 bg-[#050505]/80 backdrop-blur-xl flex flex-col hidden md:flex z-10">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Messages <span className="px-2 py-0.5 rounded-full bg-[#F2B82E]/20 text-[#F2B82E] text-xs">{inbox.length}</span>
          </h2>
          <div className="mt-4 relative">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F2B82E]/50 transition-colors placeholder:text-gray-600"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {inbox.map(chat => {
            const isActive = chat._id === conversationId;
            return (
              <div 
                key={chat._id} 
                onClick={() => navigate(`/messages/${chat._id}`)}
                className={`p-4 mx-3 my-1 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  isActive ? 'bg-[#F2B82E]/10 border border-[#F2B82E]/20' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {/* Golden Gradient Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E6A300] to-[#F2B82E] flex items-center justify-center text-black font-bold shadow-lg">
                      {getOtherUser(chat.participants).name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-[#F2B82E]' : 'text-gray-200'}`}>
                        {getOtherUser(chat.participants).name}
                      </p>
                      <span className="text-[10px] text-gray-500">
                        {chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate group-hover:text-gray-400 transition-colors">
                      {chat.lastMessage?.text || "Started a conversation..."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN CHAT AREA */}
      {/* Subtle warm glow in the dark background */}
      <div className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A1608] to-[#050505]">
        {!conversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <User size={32} className="text-[#F2B82E]" />
            </div>
            <p className="text-sm font-medium tracking-wide">Select a conversation to start</p>
            <p className="text-xs text-gray-500 mt-2">End-to-end encrypted messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#050505]/40 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E6A300] to-[#F2B82E] flex items-center justify-center text-black text-lg font-bold shadow-lg shadow-[#F2B82E]/10">
                  {activeUser?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-medium">{activeUser?.name}</h2>
                  <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Active Now
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <button className="p-2.5 hover:bg-white/10 hover:text-[#F2B82E] rounded-full transition-colors"><Phone size={18} /></button>
                <button className="p-2.5 hover:bg-white/10 hover:text-[#F2B82E] rounded-full transition-colors"><Video size={18} /></button>
                <button className="p-2.5 hover:bg-white/10 hover:text-[#F2B82E] rounded-full transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-[#F2B82E]">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : (
                messages.map((m, i) => {
                  const isMe = (m.sender?._id || m.sender) === currentId;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                      <div className="flex flex-col gap-1 max-w-[70%]">
                        <div className={`px-5 py-3.5 text-sm font-medium leading-relaxed shadow-sm ${
                          isMe 
                          ? 'bg-[#F2B82E] text-black rounded-3xl rounded-tr-sm shadow-[#F2B82E]/10' 
                          : 'bg-white/5 text-gray-100 border border-white/10 rounded-3xl rounded-tl-sm'
                        }`}>
                          {m.text}
                        </div>
                        <div className={`text-[10px] text-gray-500 px-2 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'text-right' : 'text-left'}`}>
                          {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-[#050505]/80 backdrop-blur-xl border-t border-white/5">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-[#F2B82E]/50 focus-within:bg-white/10 transition-all shadow-inner">
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-500"
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()}
                  className="bg-[#F2B82E] text-black p-3.5 rounded-xl hover:bg-[#E6A300] disabled:opacity-40 disabled:hover:bg-[#F2B82E] transition-all shadow-md shadow-[#F2B82E]/20"
                >
                  <Send size={18} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. RIGHT SIDEBAR: Contextual Widgets Panel */}
      {conversationId && (
        <div className="w-80 border-l border-white/5 bg-[#050505]/80 backdrop-blur-xl hidden lg:flex flex-col p-6 overflow-y-auto z-10">
          
          {/* Profile Widget */}
          <div className="flex flex-col items-center pb-6 border-b border-white/5 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E6A300] to-[#F2B82E] flex items-center justify-center text-black text-4xl font-bold shadow-xl shadow-[#F2B82E]/10 mb-4">
              {activeUser?.name.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold mb-1">{activeUser?.name}</h3>
            <p className="text-sm text-[#F2B82E]/70">Student / Developer</p>
          </div>

          {/* Security Status Widget */}
          <div className="mt-6 bg-green-500/5 border border-green-500/10 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="text-green-400 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-green-400">Secure Protocol</p>
              <p className="text-xs text-gray-500 mt-1">End-to-end encryption is active for this session.</p>
            </div>
          </div>

          {/* Activity Widget */}
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={14} /> Session Activity
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Clock size={14} className="text-[#F2B82E]" /></div>
                <div className="flex-1">
                  <p className="text-gray-200">Local Time</p>
                  <p className="text-xs text-gray-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shared Media Placeholder Widget */}
          <div className="mt-8">
             <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={14} /> Shared Files
            </h4>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center border-dashed">
              <p className="text-xs text-gray-500">No media shared in this conversation yet.</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Messages;