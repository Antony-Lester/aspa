// EmailContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface EmailContextProps {
  obliInstallEmail: string;
  setObliInstallEmail: (email: string) => void;
  obliRepairEmail: string;
  setObliRepairEmail: (email: string) => void;
  weighbridgeRepairEmail: string;
  setWeighbridgeRepairEmail: (email: string) => void;
  weighbridgeInstallEmail: string;
  setWeighbridgeInstallEmail: (email: string) => void;
}

const EmailContext = createContext<EmailContextProps | undefined>(undefined);

export const EmailProvider = ({ children }: { children: ReactNode }) => {
  const [obliInstallEmail, setObliInstallEmail] = useState('');
  const [obliRepairEmail, setObliRepairEmail] = useState('');
  const [weighbridgeRepairEmail, setWeighbridgeRepairEmail] = useState('');
  const [weighbridgeInstallEmail, setWeighbridgeInstallEmail] = useState('');

  return (
    <EmailContext.Provider
      value={{
        obliInstallEmail,
        setObliInstallEmail,
        obliRepairEmail,
        setObliRepairEmail,
        weighbridgeRepairEmail,
        setWeighbridgeRepairEmail,
        weighbridgeInstallEmail,
        setWeighbridgeInstallEmail,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};