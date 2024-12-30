import React, { createContext, useContext, useState, useEffect } from 'react';
import { setItem, getItem } from './storage';

type ImagesContextType = {
  images: string[][];
  setImages: (images: string[][]) => void;
};

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

interface ImagesProviderProps {
  children: React.ReactNode;
}

export const ImagesProvider: React.FC<ImagesProviderProps> = ({ children }) => {
  const [images, setImages] = useState<string[][]>([]);

  useEffect(() => {
    const loadImages = () => {
      const savedImages = getItem('images');
      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    setItem('images', JSON.stringify(images));
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