// EmailContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    const loadEmails = async () => {
      const savedObliInstallEmail = await AsyncStorage.getItem('obliInstallEmail');
      const savedObliRepairEmail = await AsyncStorage.getItem('obliRepairEmail');
      const savedWeighbridgeRepairEmail = await AsyncStorage.getItem('weighbridgeRepairEmail');
      const savedWeighbridgeInstallEmail = await AsyncStorage.getItem('weighbridgeInstallEmail');

      if (savedObliInstallEmail) setObliInstallEmail(savedObliInstallEmail);
      if (savedObliRepairEmail) setObliRepairEmail(savedObliRepairEmail);
      if (savedWeighbridgeRepairEmail) setWeighbridgeRepairEmail(savedWeighbridgeRepairEmail);
      if (savedWeighbridgeInstallEmail) setWeighbridgeInstallEmail(savedWeighbridgeInstallEmail);
    };
    loadEmails();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('obliInstallEmail', obliInstallEmail);
  }, [obliInstallEmail]);

  useEffect(() => {
    AsyncStorage.setItem('obliRepairEmail', obliRepairEmail);
  }, [obliRepairEmail]);

  useEffect(() => {
    AsyncStorage.setItem('weighbridgeRepairEmail', weighbridgeRepairEmail);
  }, [weighbridgeRepairEmail]);

  useEffect(() => {
    AsyncStorage.setItem('weighbridgeInstallEmail', weighbridgeInstallEmail);
  }, [weighbridgeInstallEmail]);

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