'use client'

import React, { ReactNode } from 'react';
import SideBar from "./sideBar";

interface LayoutProps{
    children: ReactNode
}

// eslint-disable-next-line @next/next/no-async-client-component
const Layout =async ({ children }: LayoutProps) => {
  
    return (
      <div className="w-full flex h-screen">
        <div className='flex h-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6'>
          <SideBar  />
        </div>
        { children }
        <div className=''>
        </div>
      </div>
    );
  };
  
export default Layout
