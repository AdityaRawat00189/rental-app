// import React, { useState, useEffect, useMemo } from 'react';
// import { LayoutDashboard, ShoppingCart, Handshake, Wallet, Star, Plus, Search, Bell } from 'lucide-react';
// import axios from 'axios';

// const Dashboard = () => {
//   const [bookings, setBookings] = useState([]);
//   const [view, setView] = useState('renter'); // 'renter' or 'lender'
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [refreshTrigger, setRefreshTrigger] = useState(0); 

//   // Get current User ID from localStorage
//   const userStr = localStorage.getItem('user');
//   const currentUser = userStr ? JSON.parse(userStr) : null;
//   const currentUserId = currentUser?.id || currentUser?._id;


//   const handleStatusUpdate = async (bookingId, newStatus) => {
//     try {
//       const token = currentUser?.token;
//       // Backend route update: /api/booking/status/:id

//       const BASE_URL = import.meta.env.VITE_BASE_URL;
//       const res = await axios.patch(`${BASE_URL}/api/booking/status/${bookingId}`, 
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.status === 200) {
//         // Update state locally so UI changes immediately
//         setBookings(prev => prev.map(b => 
//           b._id === bookingId ? { ...b, status: newStatus } : b
//         )); 
//       }
//       setRefreshTrigger(prev => prev + 1);
//     } catch (error) {
//       console.error("Status update failed:", error);
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = currentUser?.token;
//         if (!token) return;

//         const BASE_URL = import.meta.env.VITE_BASE_URL;
//         const res = await axios.get(`${BASE_URL}/api/booking/dashboard`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         // The data from your MongoDB response is an array of bookings
//         setBookings(res.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         alert("Protocol Error: Data Retrieval Failed");
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [currentUserId, refreshTrigger]);

//   // 1. DYNAMIC FILTERING based on Role and Search
//   const filteredData = useMemo(() => {
//     return bookings.filter(b => {
//       // Determine if the user is the renter or the owner in this booking
//       const isRenterView = view === 'renter' && b.renter?._id === currentUserId;
//       const isLenderView = view === 'lender' && b.owner?._id === currentUserId;
      
//       const matchesSearch = b.item?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
//       return (isRenterView || isLenderView) && matchesSearch;
//     });
//   }, [bookings, view, searchTerm, currentUserId]);

//   // 2. DYNAMIC METRICS
//   const stats = useMemo(() => {
//     const asRenter = bookings.filter(b => b.renter?._id === currentUserId);
//     const asLender = bookings.filter(b => b.owner?._id === currentUserId);
    
//     return {
//       activeRentals: asRenter.filter(b => b.status === 'Approved').length,
//       itemsLent: asLender.length,
//       // Total earnings would require a price field in your Item or Booking schema
//       totalEarnings: asLender.filter(b => b.status === 'Approved').length * 500, // Placeholder calculation
//       trustScore: 4.9
//     };
//   }, [bookings, currentUserId]);

//   if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400">Loading Dashboard...</div>;
  

//   return (
//     <div className="flex min-h-screen bg-black text-gray-100 font-sans">
//       {/* Sidebar */}
//       <aside className="w-64 border-r border-gray-800 hidden md:flex flex-col">
//         <div className="p-6 text-2xl font-bold text-yellow-400 tracking-tighter">CAMPUS<span className="text-white">LINK</span></div>
//         <nav className="flex-1 px-4 space-y-2 mt-4">
//           <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-400 text-black font-bold cursor-pointer shadow-[0_0_15px_rgba(250,204,21,0.3)]">
//             <LayoutDashboard size={20}/><span className="text-sm">Dashboard</span>
//           </div>
//         </nav>
//       </aside>

//       <main className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
//           <div className="relative w-96">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
//             <input 
//               type="text" 
//               placeholder={`Search your ${view} listings...`} 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-gray-900 border border-gray-800 rounded-md py-1.5 pl-10 pr-4 focus:outline-none focus:border-yellow-400 transition-colors"
//             />
//           </div>
//           <button className="bg-yellow-400 text-black px-4 py-1.5 rounded-md font-bold text-sm hover:shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all">
//             <Plus size={16} className="inline mr-1" /> List New Item
//           </button>
//         </header>

//         <div className="p-8 max-w-7xl mx-auto w-full">
//           {/* STATS */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//             <StatCard label="Active Rentals" value={stats.activeRentals} icon={<ShoppingCart className="text-yellow-400" />} />
//             <StatCard label="Your Items Lent" value={stats.itemsLent} icon={<Handshake className="text-yellow-400" />} />
//             <StatCard label="Est. Earnings" value={`₹${stats.totalEarnings}`} icon={<Wallet className="text-yellow-400" />} />
//             <StatCard label="Trust Score" value={stats.trustScore} icon={<Star className="text-yellow-400" />} />
//           </div>

//           {/* VIEW TOGGLE */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="inline-flex p-1 bg-gray-900 border border-gray-800 rounded-lg">
//               {['renter', 'lender'].map((role) => (
//                 <button 
//                   key={role}
//                   onClick={() => { setView(role); setSearchTerm(''); }}
//                   className={`px-8 py-2 rounded-md text-sm font-bold capitalize transition-all ${view === role ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
//                 >
//                   As {role}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* TABLE */}
//           <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden border-t-4 border-t-yellow-400">
//             <table className="w-full text-left">
//               <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-widest">
//                 <tr>
//                   <th className="px-6 py-4">Item Details</th>
//                   <th className="px-6 py-4">{view === 'renter' ? 'Lending Owner' : 'Customer Renter'}</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-800">
//                 {filteredData.map(booking => (
//                   <tr key={booking._id} className="hover:bg-yellow-400/5 transition-colors group">
//                     <td className="px-6 py-4">
//                       <p className="font-bold text-white">{booking.item?.title}</p>
//                       <p className="text-xs text-gray-500">ID: {booking._id.slice(-6)}</p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-sm font-medium text-gray-200">
//                         {view === 'renter' ? booking.owner?.name : booking.renter?.name}
//                       </p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border ${
//                         booking.status === 'Approved' ? 'border-green-500 text-green-500' : 
//                         booking.status === 'Pending' ? 'border-yellow-500 text-yellow-500' : 
//                         booking.status === 'Cancelled' ? 'border-red-500 text-red-500' : 'border-gray-500 text-gray-500'
//                       }`}>
//                         {booking.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       {/* --- ACTION LOGIC --- */}
//                       {view === 'lender' && booking.status === 'Pending' ? (
//                         <div className="flex gap-2 justify-end">
//                           <button 
//                             onClick={() => handleStatusUpdate(booking._id, 'Approved')}
//                             className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-[10px] font-bold uppercase transition-all"
//                           >
//                             Accept
//                           </button>
//                           <button 
//                             onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
//                             className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       ) : (
//                         <button className="bg-gray-800 hover:bg-yellow-400 hover:text-black px-3 py-1 rounded text-[10px] font-bold uppercase transition-all">
//                           Details
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// const StatCard = ({ label, value, icon }) => (
//   <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-yellow-400/50 transition-all">
//     <div className="flex justify-between items-start mb-4">
//       <div className="p-2 bg-black rounded-lg border border-gray-800">{icon}</div>
//     </div>
//     <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{value}</h3>
//     <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
//   </div>
// );

// export default Dashboard;

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Handshake, Wallet, Star, 
  Plus, Search, ArrowRight, Shield, Zap, Clock, Info, X, Check
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
      console.error("Fetch error:", error);
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
      // Immediate local update
      setRefreshTrigger(prev => prev + 1);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert("Protocol Error: Status update failed.");
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
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Protocol Data...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F2B82E] selection:text-black">
      {/* Sidebar - Lean & Tech Focused */}
      <aside className="fixed left-0 top-0 h-full w-20 border-r border-white/5 bg-black hidden lg:flex flex-col items-center py-10 gap-10 z-50">
        <div className="text-[#F2B82E] font-black text-xl italic tracking-tighter">CL</div>
        <nav className="flex flex-col gap-8">
          <div className="p-3 bg-[#F2B82E] text-black rounded-2xl shadow-[0_0_20px_rgba(242,184,46,0.2)] cursor-pointer">
            <LayoutDashboard size={20} />
          </div>
          <div className="p-3 text-white/20 hover:text-white cursor-pointer transition-colors">
            <Handshake size={20} onClick={() => navigate('/my-listings')} />
          </div>
        </nav>
      </aside>

      <main className="lg:pl-20">
        {/* Header Module */}
        <header className="pt-24 pb-12 px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
                Command <span className="text-[#F2B82E]">Center</span>
              </h1>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Active Transaction Archives // College Protocol</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter Archives..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold focus:border-[#F2B82E] outline-none transition-all w-64"
                />
               </div>
               <button onClick={() => navigate('/list-item')} className="bg-[#F2B82E] text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#F2B82E]/10 flex items-center gap-2">
                 <Plus size={14} /> New Asset
               </button>
            </div>
          </div>
        </header>

        <div className="px-8 max-w-7xl mx-auto space-y-12">
          {/* METRIC GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Active Deployments" value={stats.activeRentals} icon={<ShoppingCart size={18}/>} />
            <StatCard label="Protocol Earnings" value={`₹${stats.earnings}`} icon={<Wallet size={18}/>} />
            <StatCard label="Trust Index" value={stats.trustScore} icon={<Star size={18}/>} />
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex gap-4 border-b border-white/5 pb-6">
            {['renter', 'lender'].map((role) => (
              <button 
                key={role}
                onClick={() => setView(role)}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all pb-2 border-b-2 ${view === role ? 'text-[#F2B82E] border-[#F2B82E]' : 'text-white/20 border-transparent hover:text-white'}`}
              >
                Archive: As {role}
              </button>
            ))}
          </div>

          {/* TRANSACTION LOGS */}
          <div className="space-y-4 pb-20">
            {filteredData.length > 0 ? filteredData.map(booking => (
              <motion.div 
                key={booking._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex flex-col lg:flex-row items-center justify-between gap-8 hover:bg-white/[0.04] transition-all"
              >
                {/* Item Info */}
                <div className="flex items-center gap-6 w-full lg:w-1/3">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex-shrink-0 overflow-hidden">
                    <img src={booking.item?.images[0]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight">{booking.item?.title}</h3>
                    <p className="text-[9px] font-bold text-white/20 tracking-[0.2em] uppercase">Ref ID: {booking._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                {/* Date Logic */}
                <div className="flex items-center gap-6 px-8 border-x border-white/5 w-full lg:w-1/3 justify-center text-center">
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Start</p>
                    <p className="text-xs font-bold">{new Date(booking.startDate).toLocaleDateString()}</p>
                  </div>
                  <ArrowRight size={14} className="text-[#F2B82E]" />
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">End</p>
                    <p className="text-xs font-bold">{new Date(booking.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between w-full lg:w-1/3">
                  <div className="text-left">
                    <p className="text-[8px] font-black text-[#F2B82E] uppercase tracking-widest mb-1">Value</p>
                    <p className="text-2xl font-black italic">₹{booking.totalPrice || 0}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {view === 'lender' && booking.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusUpdate(booking._id, 'Approved')} className="bg-[#F2B82E] text-black p-2 rounded-xl hover:scale-110 transition-transform"><Check size={16}/></button>
                        <button onClick={() => handleStatusUpdate(booking._id, 'Cancelled')} className="bg-white/5 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={16}/></button>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${
                        booking.status === 'Approved' ? 'border-green-500/50 text-green-500 bg-green-500/5' : 
                        booking.status === 'Pending' ? 'border-[#F2B82E]/50 text-[#F2B82E] bg-[#F2B82E]/5' : 
                        'border-white/10 text-white/20'
                      }`}>
                        {booking.status}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                <Info className="mx-auto text-white/10 mb-4" size={32} />
                <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">No Archived Logs Found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-white/[0.04] transition-all">
    <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-[#F2B82E]/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-4xl font-black italic tracking-tighter mb-1 uppercase">{value}</h3>
    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{label}</p>
  </div>
);

export default Dashboard;