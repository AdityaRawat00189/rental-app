import React from 'react'
import { MapPin, User, Clock } from 'lucide-react';

const ItemCard = ({item}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
        {/* 1. Product Image with Category Badge */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-3 left-3 bg-[#1C2E4A] text-[#F2B82E] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                {item.category}
            </div>
        </div>

        {/* 2. Product Details */}
        <div className="p-5 flex flex-col grow">
            <h3 className="text-lg font-bold mb-3 line-clamp-1 text-[#1C2E4A]">{item.title}</h3>

            {/* Local Metadata (Hostel & Room) */}
            <div className="space-y-2.5 mb-6">
                <div className="flex items-center text-gray-500 text-xs gap-2">
                    <User size={14} className='text-[#F2B82E]'></User>
                    <span>Lender: <span className="font-bold text-gray-800">{item.lender}</span></span>
                </div>
                <div className="flex items-start text-gray-500 text-xs gap-2">
                    <MapPin size={14} className='text-[#F2B82E] mt-0.5' ></MapPin>
                    <span className="leading-tight">
                        Hostel: <span className="font-bold text-gray-800">{item.hostel}</span><br />
                        <span className="text-gray-400">Room {item.room}</span>
                    </span>
                </div>
                
                {/* 3. Pricing & Call to Action */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xl font-black text-[#1C2E4A]">₹{item.price}</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Per Day</span>
                </div>
                <button className="bg-[#F2B82E] hover:bg-[#1C2E4A] hover:text-white text-[#1C2E4A] text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm active:scale-95">
                    View Details
                </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ItemCard