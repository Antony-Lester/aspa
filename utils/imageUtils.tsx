import RNFS from 'react-native-fs';
import { requestStoragePermissions } from './permissionsUtils';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { setItem } from './storage';

export const deleteImage = async (
  fullScreenImage: { uri: string, index: number } | null,
  images?: string[][],
  setImages?: (images: string[][]) => void,
  setFullScreenImage?: (image: { uri: string, index: number } | null) => void
) => {
  console.log('----- deleteImage -----');
  if (fullScreenImage) {
    const hasPermissions = await requestStoragePermissions();
    if (!hasPermissions) {
      console.error('Storage permissions denied');
      return;
    }

    if (images && setImages) {
      const newImages = [...images];
      const imageUris = newImages[fullScreenImage.index].filter(uri => uri !== fullScreenImage.uri);
      newImages[fullScreenImage.index] = imageUris;
      setImages(newImages);
    }

    if (setFullScreenImage) {
      setFullScreenImage(null);
    }

    const fileName = fullScreenImage.uri.split('/').pop();
    if (fileName) {
      const privateFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const publicFilePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      const dcimDirPath = `${RNFS.ExternalStorageDirectoryPath}/DCIM`;
      console.log(`Deleting image from private directory path: ${privateFilePath}`);
      console.log(`Deleting image from public directory path: ${publicFilePath}`);
      console.log(`Searching for image in DCIM directory path: ${dcimDirPath}`);

      try {
        await RNFS.stat(privateFilePath);
        await RNFS.unlink(privateFilePath);
        console.log(`Deleted image from private directory: ${privateFilePath}`);
      } catch (error) {
        console.error('Failed to delete image from private directory:', error);
        // Log each file name in the directory if deletion fails
        try {
          const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
          console.log(`Files AFTER in private directory: ${files.length}`);
          files.forEach(file => {
            console.log(file.name);
          });
        } catch (readDirError) {
          console.error('Failed to read private directory:', readDirError);
        }
      }

      try {
        await RNFS.stat(publicFilePath);
        await RNFS.unlink(publicFilePath);
        console.log(`Deleted image from public directory: ${publicFilePath}`);
      } catch (error) {
        console.error('Failed to delete image from public directory:', error);
        // Log each file name in the directory if deletion fails
        try {
          const files = await RNFS.readDir(RNFS.DownloadDirectoryPath);
          console.log(`Files AFTER in public directory: ${files.length}`);
          files.forEach(file => {
            console.log(file.name);
          });
        } catch (readDirError) {
          console.error('Failed to read public directory:', readDirError);
        }
      }

      // Search for and delete images in the DCIM folder
      try {
        const dcimFiles = await RNFS.readDir(dcimDirPath);
        for (const file of dcimFiles) {
          if (file.name.includes(fileName)) {
            const dcimFilePath = `${dcimDirPath}/${file.name}`;
            console.log(`Deleting image from DCIM directory path: ${dcimFilePath}`);
            try {
              await RNFS.unlink(dcimFilePath);
              console.log(`Deleted image from DCIM directory: ${dcimFilePath}`);
            } catch (unlinkError) {
              console.error('Failed to delete image from DCIM directory:', unlinkError);
            }
          }
        }
      } catch (readDirError) {
        console.error('Failed to read DCIM directory:', readDirError);
      }
    }
  }
};

const validateVIN = (vin) => {
  if (typeof vin !== 'string') {
    return false;
  }

  // Check length
  if (vin.length !== 17) {
    return false;
  }

  // Check for invalid characters
  const invalidChars = ['I', 'O', 'Q'];
  for (let char of vin) {
    if (invalidChars.includes(char)) {
      return false;
    }
  }

  // VIN character weights
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  // VIN character values
  const transliterations = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 0: 0
  };

  // Calculate the check digit
  let sum = 0;
  for (let i = 0; i < vin.length; i++) {
    const char = vin[i];
    const value = transliterations[char];
    const weight = weights[i];
    sum += value * weight;
  }

  const checkDigit = vin[8];
  const calculatedCheckDigit = sum % 11 === 10 ? 'X' : (sum % 11).toString();

  return checkDigit === calculatedCheckDigit;
};

export const recognizeVinInImage = async (imageUri: string, setDetectedVin: (vin: string) => void) => {
  try {
    const result = await TextRecognition.recognize(imageUri);
    console.log('Recognized text:', result.text);

    for (let block of result.blocks) {
      for (let line of block.lines) {
        const cleanedText = line.text.replace(/[\s\n\t]/g, '');
        if (cleanedText.length === 17 && validateVIN(cleanedText)) {
          console.log(`Detected VIN: ${cleanedText}`);
          setDetectedVin(cleanedText);
          setItem('detectedVin', cleanedText);
          return;
        }
      }
    }
    console.log('No valid VIN found in the image.');
  } catch (error) {
    console.error('Failed to recognize text in image:', error);
  }
};

export const savePicture = async (assetUri: string, buttonName: string, index: number, images: string[][], setImages: (images: string[][]) => void, setDetectedVin: (vin: string) => void) => {
  const newImages = [...images];
  const pictureNumber = newImages[index].length + 1;
  const fileName = `${buttonName.replace(/\s+/g, '_')}_${pictureNumber}.jpg`;
  const privateFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  console.log(`Saving picture to private directory: ${privateFilePath}`);

  try {
    // Save to private directory
    await RNFS.copyFile(assetUri, privateFilePath);
    const fileSizePrivate = await RNFS.stat(privateFilePath).then(stat => stat.size);
    console.log(`File saved to private directory: ${privateFilePath}, size: ${fileSizePrivate} bytes`);

    // Update state with the private file path only
    newImages[index] = [...newImages[index], privateFilePath];
    console.log(`Updated images state for index ${index}:`, newImages[index]);
    setImages(newImages);

    // If the button name is "Chassis Plate", recognize VIN in the image
    if (buttonName === 'Chassis Plate') {
      await recognizeVinInImage(privateFilePath, setDetectedVin);
    }

    return privateFilePath;
  } catch (error) {
    console.error('Failed to save image:', error);
    throw error;
  }
};

export const recognizeTextInImage = async (imageUri: string) => {
  try {
    const result = await TextRecognition.recognize(imageUri);
    console.log('Recognized text:', result.text);

    for (let block of result.blocks) {
      console.log('Block text:', block.text);
      console.log('Block frame:', block.frame);

      for (let line of block.lines) {
        console.log('Line text:', line.text);
        console.log('Line frame:', line.frame);
      }
    }
  } catch (error) {
    console.error('Failed to recognize text in image:', error);
  }
};