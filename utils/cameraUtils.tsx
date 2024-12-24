// utils/cameraUtils.ts
import { launchCamera } from 'react-native-image-picker';
import { savePicture } from './imageUtils';

export const openCamera = (index: number, buttonName: string, images: string[][], setImages: (images: string[][]) => void) => {
  launchCamera({ mediaType: 'photo', quality: 0.2 }, async (response) => {
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