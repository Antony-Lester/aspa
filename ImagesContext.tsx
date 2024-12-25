import React, { createContext, useContext, useState } from 'react';

type ImagesContextType = {
  images: string[][];
  setImages: (images: string[][]) => void;
};

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export const ImagesProvider: React.FC = ({ children }) => {
  const [images, setImages] = useState<string[][]>([]);

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