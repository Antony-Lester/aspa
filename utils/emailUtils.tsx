// utils/emailUtils.ts
import { Linking } from 'react-native';

export const sendEmail = (email: string, subject: string, body: string) => {
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  Linking.openURL(mailtoUrl).catch((err) => {
    console.error('Failed to open mail app:', err);
  });
};

export const openMailApp = (email: string, subject: string, body: string) => {
  sendEmail(email, subject, body);
};