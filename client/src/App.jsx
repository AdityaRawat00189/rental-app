// import viteLogo from '/vite.svg'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {

  return (
    <Router >
      <Navbar></Navbar>
      <div className="bg-[#1C2E4A]">
        <Routes>
          <Route path='/' element={<Home></Home>} ></Route>
          <Route path='/home2' element={<Home2></Home2>} ></Route>
          <Route path='/ProductDetail/:id' element={<ProductDetail></ProductDetail>} ></Route>
          <Route path='/lend' element={<LendItem></LendItem>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/signup' element={<Signup></Signup>}></Route>
          <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
          <Route path='/my-listings' element={<AssetManager></AssetManager>}></Route>
          <Route path='/messages' element={<Messages></Messages>}></Route>
          <Route path='/messages/:conversationId' element={<Messages></Messages>}></Route>
          <Route path='/active-exchange' element={<ActiveExchange></ActiveExchange>}></Route>
          <Route path='/product-lifecycle' element={<LifeCycleLogs></LifeCycleLogs>}></Route>
        </Routes>
      </div>

      <ChatWidget></ChatWidget>
    </Router>
  )
}

export default App
