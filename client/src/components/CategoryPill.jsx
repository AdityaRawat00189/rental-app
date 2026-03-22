import React from 'react';

const CategoryPill = ({ name, icon }) => {
  return (
    <div className="flex items-center gap-3 bg-white border-2 border-gray-100 px-6 py-3 rounded-full shadow-sm cursor-pointer hover:border-[#F2B82E] hover:bg-[#1C2E4A] transition-all duration-300 group hover:shadow-lg active:scale-95">
      
      {/* Icon: Changes to Gold and scales up on hover */}
      <span className="text-gray-400 group-hover:text-[#F2B82E] group-hover:scale-110 transition-all duration-300">
        {icon}
      </span>

      {/* Text: Changes to White when the background turns Navy */}
      <span className="text-sm font-bold tracking-tight text-[#1C2E4A] group-hover:text-white transition-colors duration-300">
        {name}
      </span>

    </div>
  );
};

export default CategoryPill;