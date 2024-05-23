'use client';
import React, { createContext, useContext, useState } from 'react';

type SubMenuContextProviderProps = {
  children: React.ReactNode;
};

type SubMenuContext = {
  collapsedSubMenu: boolean;
  setCollapsedSubMenu: React.Dispatch<React.SetStateAction<boolean>>; 
};

const SubMenuContext = createContext<SubMenuContext | null>(null);

export const SubMenuContextProvider = ({ children }: SubMenuContextProviderProps) => {
  const [collapsedSubMenu, setCollapsedSubMenu] = useState(true);

  return (
    <SubMenuContext.Provider value={{ collapsedSubMenu, setCollapsedSubMenu }}>
      {children}
    </SubMenuContext.Provider>
  );
};

export const useSubMenuContext = () => {
  const context = useContext(SubMenuContext);
  if (!context) {
    throw new Error(
      "useSubMenuContext must be used within a SubMenuContextProvider"
    );
  };
  return context;
};