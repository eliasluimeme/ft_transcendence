"use client";

import {MyContext} from '@/components/game/tools/ModeContext';
import { MyContextProvider } from '@/components/game/tools/MyContextProvider';
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import Tab  from '@/components/game/elements/Tab'

export default function page() {
  const router = useRouter();
  const mode = useContext(MyContext);
  const text = "Welcome to the classic game of Ping Pong! In this version, you'll be facing off against \
  a computer-controlled bot. The objective is simple: score as many points as possible by keeping the ball in play.";
  const findRoom = (t: string, m: string) => {
    if (t == "player" || t == "bot") {
      const { contextValue, updateContextValue} = mode;
      updateContextValue({modeChoosed:true, type:t, mode:m})
      router.push(`/game/board`); 
    }
  };

  return (
    <div className='py-16 font-custom w-full h-full bg-[#16304b] grid sm:grid-cols-1 lg:grid-cols-1 md:p-5 lg:p-10'>
      <div className="container m-auto px-6 text-gray-500 md:px-12 xl:px-0">
        <div className="mx-auto grid gap-6 md:w-3/4 lg:w-full lg:grid-cols-2">
          <Tab typ e= "Bot" mode= "Easy" text= {text} bfunction= {() => findRoom('bot', '3')} />
          <Tab type= "Bot" mode= "Medium" text= {text} bfunction= {() => findRoom('bot', '2')} />
          <Tab type= "Bot" mode= "Hard" text= {text} bfunction= {() => findRoom('bot', '1')} />
          <Tab type= "Player" mode= "None" text= {text} bfunction={() => findRoom('player', '')} />
        </div>
      </div>                     
    </div>
  )
}
