'use client';
import React, { createContext, useContext, useState } from 'react';

type SidebarContextProviderProps = {
  children: React.ReactNode;
};

type SidebarContext = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>; 
};

const SidebarContext = createContext<SidebarContext | null>(null);

export const SidebarContextProvider = ({ children }: SidebarContextProviderProps) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext must be used within a SidebarContextProvider"
    );
  };
  return context;
};