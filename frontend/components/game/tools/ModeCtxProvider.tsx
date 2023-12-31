"use client";
import { useState } from 'react';
import { ModeContext } from './Contexts';

export const ModeCtxProvider = ({ children }: {
  children: JSX.Element;
}) => {
  const [mode, setContextValue] = useState<string>("");

  const updateContextValue = (newValue: any) => {
    setContextValue(newValue);
  };

  return (
    <ModeContext.Provider value={{mode, updateContextValue }}>
      {children}
    </ModeContext.Provider>
  );
};
