'use client';
import React, { createContext, useContext, useState } from 'react';

type ModalContextProviderProps = {
  children: React.ReactNode;
};

type ModalContext = {
  isSaveModalOpen: boolean;
  setIsSaveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalContext = createContext<ModalContext | null>(null);

export const ModalContextProvider = ({ children }: ModalContextProviderProps) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ 
        isSaveModalOpen, setIsSaveModalOpen,
        isEditModalOpen, setIsEditModalOpen,
        isDeleteModalOpen, setIsDeleteModalOpen
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useModalContext must be used within a ModalContextProvider"
    );
  };
  return context;
};