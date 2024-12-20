import RNFS from 'react-native-fs';
import { requestStoragePermissions } from './permissionsUtils'; 
export const deleteImage = (
  fullScreenImage: { uri: string, index: number } | null,
  images: string[][],
  setImages: (images: string[][]) => void,
  setFullScreenImage: (image: { uri: string, index: number } | null) => void
) => {
  if (fullScreenImage) {
    const newImages = [...images];
    newImages[fullScreenImage.index] = newImages[fullScreenImage.index].filter(uri => uri !== fullScreenImage.uri);
    setImages(newImages);
    setFullScreenImage(null);
  }
};

export const savePicture = async (assetUri: string, buttonName: string, index: number, images: string[][], setImages: (images: string[][]) => void) => {
  const newImages = [...images];
  const pictureNumber = newImages[index].length + 1;
  const fileName = `${buttonName.replace(/\s+/g, '_')}_${pictureNumber}.jpg`;
  const privateFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  try {
    const hasStoragePermissions = await requestStoragePermissions();
    if (!hasStoragePermissions) {
      console.error('Storage permissions denied');
      return;
    }
    await RNFS.copyFile(assetUri, privateFilePath);
    const fileSize = await RNFS.stat(privateFilePath).then(stat => stat.size);
    console.log(`File saved to private directory: ${privateFilePath}, size: ${fileSize} bytes`);
    newImages[index] = [...newImages[index], privateFilePath];
    console.log(`Updated images state for index ${index}:`, newImages[index]);
    setImages(newImages);
  } catch (error) {
    console.error('Failed to save image:', error);
  }
};