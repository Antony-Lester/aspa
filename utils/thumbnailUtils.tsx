import { Image } from 'react-native';

export const getThumbnailStyle = (uri: string, callback: (style: any) => void) => {
  Image.getSize(uri, (width, height) => {
    const maxSize = 150;
    let thumbnailWidth = width;
    let thumbnailHeight = height;

    if (width > height) {
      if (width > maxSize) {
        thumbnailWidth = maxSize;
        thumbnailHeight = (height / width) * maxSize;
      }
    } else {
      if (height > maxSize) {
        thumbnailHeight = maxSize;
        thumbnailWidth = (width / height) * maxSize;
      }
    }

    callback({
      width: thumbnailWidth,
      height: thumbnailHeight,
      margin: 5,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'gray', // Default border color
    });
  });
};