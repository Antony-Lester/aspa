import TextRecognition from '@react-native-ml-kit/text-recognition';
import { setItem } from '../storage';
import { Platform } from 'react-native';

const validRegCurrentStyle = (reg: string) => {
  const currentStyle = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$/; // 2001 onwards
  return currentStyle.test(reg);
};

const validRegPrefixStyle = (reg: string) => {
  const prefixStyle = /^[A-Z]{1}[0-9]{1,3}\s?[A-Z]{3}$/; // 1983-2001
  return prefixStyle.test(reg);
};

const validRegSuffixStyle = (reg: string) => {
  const suffixStyle = /^[A-Z]{3}\s?[0-9]{1,3}[A-Z]{1}$/; // 1963-1983
  return suffixStyle.test(reg);
};

const getContentUri = (filePath: string) => {
  if (Platform.OS === 'android') {
    return `file://${filePath}`;
  }
  return filePath;
};

export const recognizeRegInImage = async (imageUri: string) => {
  try {
    const contentUri = getContentUri(imageUri);
    const result = await TextRecognition.recognize(contentUri);
    console.log('Recognized text:', result.text);

    let detectedReg = '';

    for (const block of result.blocks) {
      for (const line of block.lines) {
        const cleanedText = line.text.replace(/[\s\n\t]/g, '');

        if (validRegCurrentStyle(cleanedText)) {
          console.log(`Detected Registration (Current Style): ${cleanedText}`);
          setItem('detectedReg', cleanedText);
          return;
        } else if (validRegPrefixStyle(cleanedText)) {
          console.log(`Detected Registration (Prefix Style): ${cleanedText}`);
          detectedReg = cleanedText;
        } else if (validRegSuffixStyle(cleanedText)) {
          console.log(`Detected Registration (Suffix Style): ${cleanedText}`);
          detectedReg = cleanedText;
        }
      }
    }

    if (detectedReg) {
      console.log(`Detected Registration: ${detectedReg}`);
      setItem('detectedReg', detectedReg);
    } else {
      console.log('No valid registration found in the image.');
    }
  } catch (error) {
    console.error('Failed to recognize text in image:', error);
  }
};