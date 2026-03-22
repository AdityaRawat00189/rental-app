import React, { useState } from "react";
import { Settings, Book, Beaker, Smartphone, Sofa, LayoutGrid } from 'lucide-react';

const Category = () => {
    const [active, setActive] = useState('All Assets');

    const categories = [
        { id: 'all', name: 'All Assets', icon: <LayoutGrid size={16} /> },
        { id: 'tech', name: 'Technical', icon: <Settings size={16} /> },
        { id: 'docs', name: 'Manuscripts', icon: <Book size={16} /> },
        { id: 'lab', name: 'Scientific', icon: <Beaker size={16} /> },
        { id: 'hard', name: 'Hardware', icon: <Smartphone size={16} /> },
        // { id: 'infra', name: 'Infrastructure', icon: <Sofa size={16} /> },
    ];

    return (
        <section className="bg-[#050505] border-y border-white/5 sticky top-18 z-40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-20 gap-8">
                    
                    {/* 1. Minimalist Indicator */}
                    <div className="hidden lg:flex items-center gap-3 border-r border-white/10 pr-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F2B82E] shadow-[0_0_10px_#F2B82E]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Filter</span>
                    </div>

                    {/* 2. Optimized Scroller */}
                    <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                        {categories.map((cat) => {
                            const isActive = active === cat.name;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActive(cat.name)}
                                    className={`flex items-center gap-3 px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-500 border ${
                                        isActive 
                                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                                        : 'bg-transparent text-white/40 border-transparent hover:text-white hover:border-white/10'
                                    }`}
                                >
                                    <span className={`${isActive ? 'text-black' : 'text-[#F2B82E]'} transition-colors`}>
                                        {cat.icon}
                                    </span>
                                    <span className="text-[11px] font-black uppercase tracking-widest">
                                        {cat.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 3. Action Utility */}
                    <div className="hidden md:flex items-center border-l border-white/10 pl-8">
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#F2B82E] hover:text-white transition-colors">
                            + Add Request
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Category;