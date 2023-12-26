"use client"
import { createContext } from 'react';
import { CtxType } from '../interfaces/data';


export interface ProvideType {
    contextValue:CtxType,
    updateContextValue: (newValue: CtxType) => void
}
export const MyContext = createContext<ProvideType>(
  {  contextValue: {
    modeChoosed : false,
    type: '',
    mode:''
    },
    updateContextValue:(newValue: CtxType) => {}
  }
);