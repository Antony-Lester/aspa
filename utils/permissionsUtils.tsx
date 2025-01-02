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

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        console.warn('Camera permission denied');
        showPermissionAlert('Camera Permission Required', 'This app needs camera permissions to function properly. Please grant the permissions in the app settings.');
        return false;
      }
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
      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else {
        console.warn('Storage permissions denied');
        return true;
      }
    }
    return true;
  } catch (err) {
    console.warn(err);
    return true;
  }
};

export const requestBluetoothPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const scanGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: 'Bluetooth Scan Permission',
          message: 'This app needs access to scan for Bluetooth devices.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const connectGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'Bluetooth Connect Permission',
          message: 'This app needs access to connect to Bluetooth devices.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (
        scanGranted === PermissionsAndroid.RESULTS.GRANTED &&
        connectGranted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else {
        console.warn('Bluetooth permissions denied');
        showPermissionAlert('Bluetooth Permission Required', 'This app needs Bluetooth permissions to function properly. Please grant the permissions in the app settings.');
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const showPermissionAlert = (title: string, message: string) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
    { cancelable: false }
  );
};

export const requestAllPermissions = async (sourcePage: string): Promise<boolean> => {
  const cameraPermission = await requestCameraPermission();
  const storagePermission = await requestStoragePermissions();
  let bluetoothPermission = true;

  if (sourcePage === 'WeighPads') {
    bluetoothPermission = await requestBluetoothPermissions();
  }

  return cameraPermission && storagePermission && bluetoothPermission;
};
