// utils/emailUtils.ts
import { PermissionsAndroid, Platform } from 'react-native';
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