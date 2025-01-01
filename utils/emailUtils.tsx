// utils/emailUtils.ts
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Mailer from 'react-native-mail';
import RNFS from 'react-native-fs';
import { setItem } from '../storage';

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

export const handleOpenMailApp = (
  vin: string,
  reg: string | undefined,
  email: string,
  buttonNames: string[],
  images: string[][],
  getButtonBorderColor: (index: number) => string,
  navigation: any,
  sourcePage: string
) => {
  console.log('IN handleOpenMailApp...');
  const incompleteButtonIndex = buttonNames.findIndex(
    (name, index) => images[index].length === 0 && getButtonBorderColor(index) === 'red'
  );
  if (incompleteButtonIndex !== -1) {
    Alert.alert('Incomplete', `Please take a picture of ${buttonNames[incompleteButtonIndex]}.`);
    console.log(`Incomplete: Please take a picture of ${buttonNames[incompleteButtonIndex]}.`);
    return;
  }

  const subject = `${new Date().toISOString().split('T')[0].replace(/-/g, '/') } ${vin} ${reg || ''}`;
  
  let job = '';
  switch (sourcePage) {
    case 'ObliInstall':
      job = 'OBLI Install';
      break;
    case 'ObliRepair':
      job = 'OBLI Repair';
      break;
    case 'WeighbridgeInstall':
      job = 'Weighbridge Install';
      break;
    case 'WeighbridgeRepair':
      job = 'Weighbridge Repair';
      break;
    default:
      job = '';
  }

  const body = `Attached are the images for ${job},\n\n\nfor ${vin || ''} ${reg || ''}.`;
  const attachments = images.flat();

  console.log('IN handle email...Sending email to:', email);
  console.log('Email subject:', subject);
  console.log('Email body:', body);
  console.log('Email attachments:', attachments);

  Mailer.mail({
    subject: subject,
    recipients: [email],
    body: body,
    isHTML: true,
    attachments: attachments.map((filePath) => ({
      path: filePath,
      type: 'image',
      name: 'image',
    })),
  }, async (error, event) => {
    if (error) {
      console.error('Failed to send email:', error);
    } else {
      console.log('Email sent successfully:', event);
      await setItem('emailAppOpened', 'true');
      navigation.navigate('ConfirmEmailPage', { vin, reg, emailAddress: email, images, sourcePage });
    }
  });
};