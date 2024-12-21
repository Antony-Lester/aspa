import RNFS from 'react-native-fs';
import { requestStoragePermissions } from './permissionsUtils';

/*
 (NOBRIDGE) LOG  Saving picture to private directory: /data/user/0/com.xapp/files/Front_Sensor(s)_1.jpg
 (NOBRIDGE) LOG  Saving picture to public directory: /storage/emulated/0/Download/Front_Sensor(s)_1.jpg
 (NOBRIDGE) LOG  File saved to private directory: /data/user/0/com.xapp/files/Front_Sensor(s)_1.jpg, size: 370387 bytes
 (NOBRIDGE) ERROR  Failed to save image to public directory: [Error: ENOENT: open failed: EACCES (Permission denied), open '/storage/emulated/0/Download/Front_Sensor(s)_1.jpg']
 (NOBRIDGE) LOG  Updated images state for index 0: ["/data/user/0/com.xapp/files/Front_Sensor(s)_1.jpg", "/storage/emulated/0/Download/Front_Sensor(s)_1.jpg"]
 (NOBRIDGE) LOG  Rendering image for index 0: /data/user/0/com.xapp/files/Front_Sensor(s)_1.jpg
 (NOBRIDGE) LOG  Rendering image for index 0: /storage/emulated/0/Download/Front_Sensor(s)_1.jpg
 (NOBRIDGE) LOG  Rendering image for index 0: /data/user/0/com.xapp/files/Front_Sensor(s)_1.jpg
 (NOBRIDGE) LOG  Rendering image for index 0: /storage/emulated/0/Download/Front_Sensor(s)_1.jpg
*/



export const deleteImage = async (
  fullScreenImage: { uri: string, index: number } | null,
  images: string[][],
  setImages: (images: string[][]) => void,
  setFullScreenImage: (image: { uri: string, index: number } | null) => void
) => {
  if (fullScreenImage) {
    const newImages = [...images];
    const imageUris = newImages[fullScreenImage.index].filter(uri => uri !== fullScreenImage.uri);
    newImages[fullScreenImage.index] = imageUris;
    setImages(newImages);
    setFullScreenImage(null);

    try {
      await RNFS.unlink(fullScreenImage.uri);
      console.log(`Deleted image from ${fullScreenImage.uri}`);
    } catch (error) {
      console.error('Failed to delete image:', error);
      // Log each file name in the directory if deletion fails
      const directoryPath = fullScreenImage.uri.substring(0, fullScreenImage.uri.lastIndexOf('/'));
      try {
        const files = await RNFS.readDir(directoryPath);
        console.log(`Files in directory ${directoryPath}:`);
        files.forEach(file => {
          console.log(file.name);
        });
      } catch (readDirError) {
        console.error('Failed to read directory:', readDirError);
      }
    }

    // Attempt to delete from both private and public directories
    const fileName = fullScreenImage.uri.split('/').pop();
    if (fileName) {
      const privateFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const publicFilePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      console.log(`Deleting image from private directory: ${privateFilePath}`);
      console.log(`Deleting image from public directory: ${publicFilePath}`);
      try {
        await RNFS.unlink(privateFilePath);
        console.log(`Deleted image from private directory: ${privateFilePath}`);
      } catch (error) {
        console.error('Failed to delete image from private directory:', error);
        // Log each file name in the directory if deletion fails
        try {
          const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
          console.log(`Files in private directory:`);
          files.forEach(file => {
            console.log(file.name);
          });
        } catch (readDirError) {
          console.error('Failed to read private directory:', readDirError);
        }
      }

      try {
        await RNFS.unlink(publicFilePath);
        console.log(`Deleted image from public directory: ${publicFilePath}`);
      } catch (error) {
        console.error('Failed to delete image from public directory:', error);
        // Log each file name in the directory if deletion fails
        try {
          const files = await RNFS.readDir(RNFS.DownloadDirectoryPath);
          console.log(`Files in public directory:`);
          files.forEach(file => {
            console.log(file.name);
          });
        } catch (readDirError) {
          console.error('Failed to read public directory:', readDirError);
        }
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