// utils/imageUtils.ts
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