import React from 'react'
import { Instagram, Linkedin, Github, Globe } from 'lucide-react'

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-4 mt-8 w-full justify-center">
        <a 
            href="#"
            target='_blank' //opens in a new tab
            rel='noopener noreferrer'
            className='p-1.5 bg-white border border-gray-200 rounded-xl text-[#0077B5] hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"'
            aria-label='LinkedIn'
        ><Linkedin size={22}></Linkedin></a>
        <a 
            href="#"
            target='_blank' //opens in a new tab
            rel='noopener noreferrer'
            className='p-2 bg-white border border-gray-200 rounded-xl text-[#0077B5] hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"'
            aria-label='Instagram'
        ><Instagram size={15}></Instagram></a>
        <a 
            href="#"
            target='_blank' //opens in a new tab
            rel='noopener noreferrer'
            className='p-2 bg-white border border-gray-200 rounded-xl text-[#0077B5] hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"'
            aria-label='Github'
        ><Github size={22}></Github></a>
    </div>
  )
}

export default SocialLinks;