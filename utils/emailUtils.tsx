// utils/emailUtils.ts
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Mailer from 'react-native-mail';
import RNFS from 'react-native-fs';

const requestStoragePermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const sendEmail = async (email: string, subject: string, body: string, attachments: string[]) => {
  const hasPermissions = await requestStoragePermissions();
  if (!hasPermissions) {
    console.error('Storage permissions denied');
    return;
  }
  console.log('IN sendEmail:', email);
  console.log('Subject:', subject);
  console.log('Body:', body);
  console.log('Attachments:', attachments); // Log the attachments for debugging

  Mailer.mail({
    subject: subject,
    recipients: [email],
    body: body,
    isHTML: true,
    attachments: attachments
      .map((filePath) => ({
        path: filePath, // The absolute path of the file from which to read data.
        type: 'image', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
        name: 'image', // Optional: Custom filename for attachment
      })),
  }, (error, event) => {
    if (error) {
      console.error('Failed to send email:', error);
    }
  });
};

export const openMailApp = async (email: string, subject: string, body: string, attachments: string[]) => {
  sendEmail(email, subject, body, attachments);
};

export const handleOpenMailApp = (
  vin: string,
  reg: string,
  email: string,
  buttonNames: string[],
  images: string[][],
  getButtonBorderColor: (index: number) => string,
  navigation: any
) => {
  if (!vin || vin.length < 6 || vin.length > 17) {
    Alert.alert('Invalid VIN', 'VIN should be between 6 and 17 characters long.');
    return;
  }

  if (!email) {
    Alert.alert('No Email Set', 'Please set an email address in the settings.', [
      { text: 'OK', onPress: () => navigation.navigate('Settings') },
    ]);
    return;
  }

  const incompleteButtonIndex = buttonNames.findIndex(
    (name, index) => images[index].length === 0 && getButtonBorderColor(index) === 'red'
  );
  if (incompleteButtonIndex !== -1) {
    Alert.alert('Incomplete', `Please take a picture of ${buttonNames[incompleteButtonIndex]}.`);
    return;
  }

  const subject = `${new Date().toISOString().split('T')[0].replace(/-/g, '/') } ${vin} ${reg || ''}`;
  const body = `Attached are the images for ${navigation.state.routeName}. ${vin || ''} ${reg || ''}`;
  const attachments = images.flat();

  console.log('IN handle email...Sending email to:', email);
  openMailApp(email, subject, body, attachments);
};