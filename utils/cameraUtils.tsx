// utils/cameraUtils.ts
import { PermissionsAndroid, Platform } from 'react-native';
import { launchCamera } from 'react-native-image-picker';

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const openCamera = (index: number, images: string[][], setImages: (images: string[][]) => void) => {
  launchCamera({ mediaType: 'photo' }, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const newImages = [...images];
      if (response.assets[0].uri) {
        newImages[index] = [...newImages[index], response.assets[0].uri];
      }
      setImages(newImages);
    }
  });
};