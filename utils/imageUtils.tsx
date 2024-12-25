import RNFS from 'react-native-fs';
import { requestStoragePermissions } from './permissionsUtils';

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

export const savePicture = async (assetUri: string, buttonName: string, index: number, images: string[][], setImages: (images: string[][]) => void) => {
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
  } catch (error) {
    console.error('Failed to save image:', error);
  }
};