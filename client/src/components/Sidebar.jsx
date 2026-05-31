import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Handshake, 
  MessageSquare, 
  ArrowRightLeft, 
  Package, 
  Archive, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen for responsive behavior
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={22} /> },
    { name: 'My Listings', path: '/my-listings', icon: <Handshake size={22} /> },
    { name: 'Comms Channel', path: '/messages', icon: <MessageSquare size={22} /> },
    { name: 'Scheduled Meetups', path: '/active-exchange', icon: <ArrowRightLeft size={22} /> },
    { name: 'Lifecycle Logs', path: '/product-lifecycle', icon: <Package size={22} /> },
    { name: 'Returns & Archives', path: '/returns-and-archive', icon: <Archive size={22} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Toggle Button (Visible only on small screens) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-40 p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-white hover:text-[#F2B82E] hover:border-[#F2B82E]/50 transition-all shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Backdrop overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 280 : (isMobile ? 0 : 80),
          x: isMobile && !isOpen ? -280 : 0
        }}
        // --- NEW: Hover Triggers for Desktop ---
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
        className="fixed left-0 top-0 h-full bg-[#050505] border-r border-white/5 z-50 flex flex-col justify-between overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-colors duration-300"
      >
        <div className="flex flex-col w-full">
          
          {/* Top Header / Logo Section */}
          <div className="h-24 flex items-center justify-between px-6 border-b border-white/5">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-4 cursor-pointer overflow-hidden whitespace-nowrap"
            >
              <div className="text-[#F2B82E] font-black text-2xl italic tracking-tighter flex-shrink-0">
                CL
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-white text-[10px] font-black uppercase tracking-[0.3em]"
                  >
                    Campus Link
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Close Button (Hidden on Desktop since hover handles it) */}
            {isMobile && (
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 p-4 mt-4">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <div 
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setIsOpen(false);
                  }}
                  className={`flex items-center p-3.5 rounded-2xl cursor-pointer transition-all group relative overflow-hidden ${
                    isActive 
                      ? 'bg-[#F2B82E] text-black shadow-[0_0_20px_rgba(242,184,46,0.2)]' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex-shrink-0 z-10">{item.icon}</div>
                  
                  {/* Expanded Text */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span 
                        initial={{ opacity: 0, w: 0 }}
                        animate={{ opacity: 1, w: "auto" }}
                        exit={{ opacity: 0, w: 0 }}
                        className="ml-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap z-10"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer / Logout */}
        <div className="p-4 border-t border-white/5">
          <div 
            onClick={handleLogout}
            className="flex items-center p-3.5 rounded-2xl cursor-pointer transition-all group text-red-500/60 hover:text-red-500 hover:bg-red-500/10 overflow-hidden"
          >
            <div className="flex-shrink-0"><LogOut size={22} /></div>
            <AnimatePresence>
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                >
                  {localStorage.getItem('userName').replace(/"/g, '') || 'Logout'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;