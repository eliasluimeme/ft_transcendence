"use client";
import { useState, useEffect } from 'react';
import { SocketContext } from './Contexts';
import io from 'socket.io-client';

export const SocketCtxProvider = ({ children }: {
  children: JSX.Element;
}) => {
  const socket = io('http://localhost:3001/game', {
    withCredentials: true,
  });

  useEffect( () => {
    return(() => {
      socket.disconnect();
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
