import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { Menu, X, LogOut, User, LayoutGrid } from 'lucide-react';
import logo from '../images/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScroll, setIsScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const handleScroll = () => setIsScroll(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
      isScroll ? 'bg-black/80 backdrop-blur-xl py-4 shadow-2xl' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        
        {/* Brand Identity */}
        <Link to='/' className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-[#F2B82E] to-[#ffd77a] p-2 rounded-lg">
             <img src={logo} alt="CampusLink" className="h-6 w-6 brightness-0" />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter">
            CAMPUS<span className="text-[#F2B82E]">LINK</span>
          </span>
        </Link>

        {/* Navigation - Neutral Naming */}
        <div className="hidden md:flex items-center space-x-10">
          {/* {['Marketplace', 'Lend', 'How It Works', 'About'].map((item) => (
            <a href={item === 'Marketplace' ? '/' : `#${item.toLowerCase()}`} className="text-gray-300 hover:text-white text-sm font-bold tracking-widest uppercase transition-all">{item}</a>
          ))} */}
          <Link to="/home2" className="text-gray-300 hover:text-white text-sm font-bold tracking-widest uppercase transition-all">Marketplace</Link>
          <Link to="/lend" className="text-gray-300 hover:text-white text-sm font-bold tracking-widest uppercase transition-all">Lend</Link>
          <HashLink to="/#how-it-works" className="text-gray-300 hover:text-white text-sm font-bold tracking-widest uppercase transition-all">How It Works</HashLink>
          <HashLink to="/#about" className="text-gray-300 hover:text-white text-sm font-bold tracking-widest uppercase transition-all">About Us</HashLink>
        </div>

        {/* User Logic */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 pl-2 pr-4 py-1.5 rounded-full">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F2B82E] to-[#ffa500] rounded-full flex items-center justify-center text-black font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-black px-8 py-2.5 rounded-full font-bold text-sm hover:bg-[#F2B82E] transition-all"
            >
              Join Now
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;