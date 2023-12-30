"use client"
import { createContext } from 'react';
import io from 'socket.io-client';


export interface SocketProvideType {
    socket: any,
    updateContextValue: (newValue: any) => void
}

export interface ModeProvideType {
  mode: string,
  updateContextValue: (newValue: string) => void
}

export const SocketContext = createContext<any>({
    socket: ''
  }
);

export const ModeContext = createContext<ModeProvideType>({
    mode: "",
    updateContextValue:(newValue: string) => {}
  }
);