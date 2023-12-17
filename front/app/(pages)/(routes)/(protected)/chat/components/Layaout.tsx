'use client'

import React, { ReactNode } from 'react';
import SideBar from "./sideBar";
import Conversation from './conversation';
import ChatInput from './ChatInput';



interface LayoutProps{
    children: ReactNode
}

// eslint-disable-next-line @next/next/no-async-client-component
const Layout =async ({ children }: LayoutProps) => {
  
    return (
      <div className="w-full flex h-screen">
        {/* <div className="w-64 bg-gray-800 text-white p-4">
        </div>
        <div className="flex-1">
        <Conversation  />
        </div> */}
        <div className='flex h-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6'>
          {/* <div className='text-xs font-semibold leading-6 text-gray-400 '> Start Talking </div> */}
          {/* <nav className='flex flex-1 flex-col'></nav> */}
          <SideBar  />
        </div>
        { children }
        <div className=''>
          {/* <ChatInput /> */}
          {/* <Conversation /> */}
        </div>
      </div>
    );
  };
  
export default Layout


//   className="w-64 bg-gray-800 text-white p-4" 
//   className="flex-1"