"use client";
import { useState } from 'react';
import { CtxType } from '../interfaces/data';
import { MyContext } from './ModeContext';


export const MyContextProvider = ({ children }: {
  children: JSX.Element;
}) => {
  const [contextValue, setContextValue] = useState<CtxType>({socket: ''});

  const updateContextValue = (newValue: CtxType) => {
    setContextValue(newValue);
  };

  return (
    <MyContext.Provider value={{ contextValue, updateContextValue }}>
      {children}
    </MyContext.Provider>
  );
};
