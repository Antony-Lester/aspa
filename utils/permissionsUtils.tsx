import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

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
      const readGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Read Storage Permission',
          message: 'This app needs access to your storage to read files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const writeGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Write Storage Permission',
          message: 'This app needs access to your storage to write files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (
        readGranted === PermissionsAndroid.RESULTS.GRANTED &&
        writeGranted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        // Check if MANAGE_EXTERNAL_STORAGE permission is needed
        if (Platform.Version >= 30) {
          const manageGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
            {
              title: 'Manage Storage Permission',
              message: 'This app needs access to manage all files.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (manageGranted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
          } else {
            console.warn('Manage storage permission denied');
            showPermissionAlert();
            return false;
          }
        }

        return true;
      } else {
        console.warn('Read/Write storage permission denied');
        showPermissionAlert();
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const showPermissionAlert = () => {
  Alert.alert(
    'Storage Permission Required',
    'This app needs storage permissions to function properly. Please grant the permissions in the app settings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
    { cancelable: false }
  );
};