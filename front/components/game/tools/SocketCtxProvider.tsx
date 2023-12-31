"use client";
import { useEffect, useState } from 'react';
import { SocketContext } from './Contexts';
// import io from 'socket.io-client';
import { Socket, io } from "socket.io-client"

export let socket: Socket;
export const SocketCtxProvider = ({ children }: {
  children: JSX.Element;
}) => {
  const initialSocket = async () => {
    socket = io(process.env.BACK_END_URL + 'game', {
      withCredentials: true,
    });
  }
  useEffect(() => {
    initialSocket();
    return (() => {
      socket.disconnect();
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
