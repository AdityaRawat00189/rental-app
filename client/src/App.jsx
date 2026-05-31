// import viteLogo from '/vite.svg'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home2 from './pages/Home2'
import ProductDetail from './pages/ProductDetail'
import LendItem from './pages/LendItem'
import Dashboard from './pages/Dashboard';
import ChatWidget from './components/ChatWidget';
import AssetManager from './pages/AssetManager';
import Messages from './pages/Messages';
import ActiveExchange from './pages/ActiveExchange';
import LifeCycleLogs from './pages/LifeCycleLogs';
import ReturnsAndArchive from './pages/ReturnAndArchieve'

import Sidebar from './components/Sidebar';

const SidebarLayout = () => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 min-w-0 lg:pl-[80px]">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      {/* Navbar appears on all pages */}
      <Navbar />

      {/* Main wrapper with your dark background */}
      <div className="bg-[#1C2E4A] min-h-screen">
        <Routes>
          {/* ==========================================
              PUBLIC PAGES (No Sidebar)
              ========================================== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ==========================================
              INTERNAL PAGES (With Sidebar)
              ========================================== */}
          <Route element={<SidebarLayout />}>
            <Route path="/home2" element={<Home2 />} />
            <Route path="/ProductDetail/:id" element={<ProductDetail />} />
            <Route path="/lend" element={<LendItem />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-listings" element={<AssetManager />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:conversationId" element={<Messages />} />
            <Route path="/active-exchange" element={<ActiveExchange />} />
            <Route path="/product-lifecycle" element={<LifeCycleLogs />} />
            <Route path="/returns-and-archive" element={<ReturnsAndArchive />} />
          </Route>
        </Routes>
      </div>

      {/* Chat widget appears on all pages */}
      <ChatWidget />
    </Router>
  );
}
export default App
