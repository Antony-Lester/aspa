import { launchCamera } from 'react-native-image-picker';
import { savePicture } from './imageUtils';
import { getItem } from '../storage';
import { requestCameraPermission, requestStoragePermissions } from './permissionsUtils';

import { PhotoQuality } from 'react-native-image-picker';

export const openCamera = async (index: number, buttonName: string, images: string[][], setImages: (images: string[][]) => void) => {
  const hasCameraPermission = await requestCameraPermission();
  const hasStoragePermissions = await requestStoragePermissions();

  if (!hasCameraPermission || !hasStoragePermissions) {
    console.log('Camera Permissions not granted');
    await requestCameraPermission();
    await requestStoragePermissions();
  }

  const quality: PhotoQuality | undefined = parseFloat(getItem('imageQuality') || '0.5') as PhotoQuality;

  const options = {
    mediaType: 'photo' as const,
    quality: quality as PhotoQuality | undefined,
    saveToPhotos: false,
  };

  launchCamera(options, async (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      const filePath = asset.uri;
      console.log(`Image captured: ${filePath}`);
      if (filePath) {
        try {
          const savedPath = await savePicture(filePath, buttonName, index, images, setImages);
          console.log(`Image saved at: ${savedPath}`);
        } catch (error) {
          console.error('Error saving image:', error);
        }
      }
    }
  });
};
