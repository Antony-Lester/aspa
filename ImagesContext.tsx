import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ImagesContextType = {
  images: string[][];
  setImages: (images: string[][]) => void;
};

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export const ImagesProvider: React.FC = ({ children }) => {
  const [images, setImages] = useState<string[][]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const savedImages = await AsyncStorage.getItem('images');
      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('images', JSON.stringify(images));
  }, [images]);

  return (
    <ImagesContext.Provider value={{ images, setImages }}>
      {children}
    </ImagesContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImagesContext);
  if (!context) {
    throw new Error('useImages must be used within an ImagesProvider');
  }
  return context;
};