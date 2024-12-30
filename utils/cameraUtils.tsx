// utils/cameraUtils.ts
import { launchCamera } from 'react-native-image-picker';
import { savePicture } from './imageUtils';
import { getItem } from '../storage';

import { PhotoQuality } from 'react-native-image-picker';

export const openCamera = async (index: number, buttonName: string, images: string[][], setImages: (images: string[][]) => void) => {
  const quality: PhotoQuality | undefined = parseFloat(getItem('imageQuality') || '0.5') as PhotoQuality; // Default to 0.5 if not set

  const options = {
    mediaType: 'photo' as const,
    quality: quality as PhotoQuality | undefined,
    saveToPhotos: false, // Do not save to camera roll
  };

  launchCamera(options, async (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      if (asset.uri) {
        const isChassisPlate = buttonName === 'Chassis Plate'; // Tag the Chassis plate image
        await savePicture(asset.uri, buttonName, index, images, setImages);
      }
    }
  });
};