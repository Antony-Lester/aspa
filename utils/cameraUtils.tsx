// utils/cameraUtils.ts
import { PermissionsAndroid, Platform } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

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

export const requestStoragePermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const openCamera = (index: number, buttonName: string, images: string[][], setImages: (images: string[][]) => void) => {
  launchCamera({ mediaType: 'photo' }, async (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const newImages = [...images];
      const asset = response.assets[0];
      if (asset.uri) {
        const pictureNumber = newImages[index].length + 1;
        const fileName = `${buttonName.replace(/\s+/g, '_')}_${pictureNumber}.jpg`;
        const privateFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        try {
          const hasStoragePermissions = await requestStoragePermissions();
          if (!hasStoragePermissions) {
            console.error('Storage permissions denied');
            return;
          }
          await RNFS.copyFile(asset.uri, privateFilePath);
          const fileSize = await RNFS.stat(privateFilePath).then(stat => stat.size);
          console.log(`File saved to private directory: ${privateFilePath}, size: ${fileSize} bytes`);
          newImages[index] = [...newImages[index], privateFilePath];
          console.log(`Updated images state for index ${index}:`, newImages[index]);
          setImages(newImages);
        } catch (error) {
          console.error('Failed to save image:', error);
        }
      }
    }
  });
};