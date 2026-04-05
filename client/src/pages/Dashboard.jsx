import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, ShoppingCart, Handshake, Wallet, Star, Plus, Search, Bell } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState('renter'); // 'renter' or 'lender'
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // Get current User ID from localStorage
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.id || currentUser?._id;


  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = currentUser?.token;
      // Backend route update: /api/booking/status/:id

      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const res = await axios.patch(`${BASE_URL}/api/booking/status/${bookingId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        // Update state locally so UI changes immediately
        setBookings(prev => prev.map(b => 
          b._id === bookingId ? { ...b, status: newStatus } : b
        )); 
      }
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = currentUser?.token;
        if (!token) return;

        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const res = await axios.get(`${BASE_URL}/api/booking/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // The data from your MongoDB response is an array of bookings
        setBookings(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Protocol Error: Data Retrieval Failed");
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUserId, refreshTrigger]);

  // 1. DYNAMIC FILTERING based on Role and Search
  const filteredData = useMemo(() => {
    return bookings.filter(b => {
      // Determine if the user is the renter or the owner in this booking
      const isRenterView = view === 'renter' && b.renter?._id === currentUserId;
      const isLenderView = view === 'lender' && b.owner?._id === currentUserId;
      
      const matchesSearch = b.item?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return (isRenterView || isLenderView) && matchesSearch;
    });
  }, [bookings, view, searchTerm, currentUserId]);

  // 2. DYNAMIC METRICS
  const stats = useMemo(() => {
    const asRenter = bookings.filter(b => b.renter?._id === currentUserId);
    const asLender = bookings.filter(b => b.owner?._id === currentUserId);
    
    return {
      activeRentals: asRenter.filter(b => b.status === 'Approved').length,
      itemsLent: asLender.length,
      // Total earnings would require a price field in your Item or Booking schema
      totalEarnings: asLender.filter(b => b.status === 'Approved').length * 500, // Placeholder calculation
      trustScore: 4.9
    };
  }, [bookings, currentUserId]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400">Loading Dashboard...</div>;
  

  return (
    <div className="flex min-h-screen bg-black text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold text-yellow-400 tracking-tighter">CAMPUS<span className="text-white">LINK</span></div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-400 text-black font-bold cursor-pointer shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            <LayoutDashboard size={20}/><span className="text-sm">Dashboard</span>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder={`Search your ${view} listings...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-md py-1.5 pl-10 pr-4 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
          <button className="bg-yellow-400 text-black px-4 py-1.5 rounded-md font-bold text-sm hover:shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all">
            <Plus size={16} className="inline mr-1" /> List New Item
          </button>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <StatCard label="Active Rentals" value={stats.activeRentals} icon={<ShoppingCart className="text-yellow-400" />} />
            <StatCard label="Your Items Lent" value={stats.itemsLent} icon={<Handshake className="text-yellow-400" />} />
            <StatCard label="Est. Earnings" value={`₹${stats.totalEarnings}`} icon={<Wallet className="text-yellow-400" />} />
            <StatCard label="Trust Score" value={stats.trustScore} icon={<Star className="text-yellow-400" />} />
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex p-1 bg-gray-900 border border-gray-800 rounded-lg">
              {['renter', 'lender'].map((role) => (
                <button 
                  key={role}
                  onClick={() => { setView(role); setSearchTerm(''); }}
                  className={`px-8 py-2 rounded-md text-sm font-bold capitalize transition-all ${view === role ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  As {role}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden border-t-4 border-t-yellow-400">
            <table className="w-full text-left">
              <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">{view === 'renter' ? 'Lending Owner' : 'Customer Renter'}</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredData.map(booking => (
                  <tr key={booking._id} className="hover:bg-yellow-400/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{booking.item?.title}</p>
                      <p className="text-xs text-gray-500">ID: {booking._id.slice(-6)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-200">
                        {view === 'renter' ? booking.owner?.name : booking.renter?.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border ${
                        booking.status === 'Approved' ? 'border-green-500 text-green-500' : 
                        booking.status === 'Pending' ? 'border-yellow-500 text-yellow-500' : 
                        booking.status === 'Cancelled' ? 'border-red-500 text-red-500' : 'border-gray-500 text-gray-500'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* --- ACTION LOGIC --- */}
                      {view === 'lender' && booking.status === 'Pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'Approved')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-[10px] font-bold uppercase transition-all"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                            className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button className="bg-gray-800 hover:bg-yellow-400 hover:text-black px-3 py-1 rounded text-[10px] font-bold uppercase transition-all">
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-yellow-400/50 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-black rounded-lg border border-gray-800">{icon}</div>
    </div>
    <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{value}</h3>
    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
  </div>
);

export default Dashboard;