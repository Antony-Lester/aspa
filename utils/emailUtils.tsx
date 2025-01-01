// utils/emailUtils.ts
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Mailer from 'react-native-mail';
import RNFS from 'react-native-fs';
import { setItem } from '../storage';
import { requestStoragePermissions } from './permissionsUtils';

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
    attachments: attachments.map((filePath) => ({
      path: filePath, // The absolute path of the file from which to read data.
      type: 'image', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
      name: 'image', // Optional: Custom filename for attachment
    })),
  }, (error, event) => {
    if (error) {
      console.error('Failed to send email:', error);
    } else {
      console.log('Email sent successfully:', event);
    }
  });
};

export const handleOpenMailApp = async (
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
  console.log('VIN:', vin);
  console.log('Reg:', reg);
  console.log('Email:', email);
  console.log('Button names:', buttonNames);
  console.log('Images:', images);
  console.log('Get button border color:', getButtonBorderColor);
  console.log('Navigation:', navigation);
  console.log('Source page:', sourcePage);
  
  const incompleteButtonIndex = buttonNames.findIndex((name, index) => images[index].length === 0 && getButtonBorderColor(index) === 'red');
  console.log('Incomplete button index:', incompleteButtonIndex);
  if (incompleteButtonIndex !== -1) {
    Alert.alert('Incomplete', `Please take a picture of ${buttonNames[incompleteButtonIndex]}.`);
    console.log(`Incomplete: Please take a picture of ${buttonNames[incompleteButtonIndex]}.`);
    return;
  }
  const subject = `${new Date().toISOString().split('T')[0].replace(/-/g, '/') } ${vin} ${reg || ''}`;
  console.log('Subject:', subject);
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
  console.log('Job:', job);
  const body = `Attached are the images for ${job},\n\n\nfor ${vin || ''} ${reg || ''}.`;
  const attachments = images.flat();

  console.log('IN handle email...Sending email to:', email);
  console.log('Email subject:', subject);
  console.log('Email body:', body);
  console.log('Email attachments:', attachments);

  try {
    await sendEmail(email, subject, body, attachments);
    await setItem('emailAppOpened', 'true');
    navigation.navigate('ConfirmEmailPage', { vin, reg, emailAddress: email, images, sourcePage });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};