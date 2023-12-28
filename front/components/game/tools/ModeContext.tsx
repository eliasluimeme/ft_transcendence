"use client"
import { createContext } from 'react';
import { CtxType } from '../interfaces/data';
import io from 'socket.io-client';


export interface ProvideType {
    contextValue:CtxType,
    updateContextValue: (newValue: CtxType) => void
}
export const MyContext = createContext<ProvideType>(
  {  contextValue: {
      socket:io('http://localhost:3001/game', {
        withCredentials: true,
      }),
    },
    updateContextValue:(newValue: CtxType) => {}
  }
);