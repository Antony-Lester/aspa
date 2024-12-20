import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Linking,
  Platform,
  StatusBarStyle,
} from 'react-native';
import { useTheme } from '../ThemeContext'; // Import useTheme
import useStyles from '../styles'; // Use styles
import { openMailApp } from '../utils/emailUtils'; // Adjust the import path as necessary
import { requestCameraPermission, openCamera } from '../utils/cameraUtils'; // Import camera utils
import { deleteImage } from '../utils/imageUtils'; // Import image utils
import RNFS from 'react-native-fs';

const ObliInstall = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(); // Use styles
  const scrollViewRef = useRef<ScrollView>(null);

  const buttonNames = [
    'Front Sensor(s)',
    'Rear Sensor(s)',
    'T Piece Locations',
    'Cab Wire Entry',
    'Power Pick Up',
    'Processor Unit',
    'Finished Cab',
    'Chassis Plate',
    'Reg Plate',
    'Other',
  ];

  const [images, setImages] = useState<string[][]>(Array(buttonNames.length).fill([]));
  const [fullScreenImage, setFullScreenImage] = useState<{ uri: string, index: number } | null>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [thumbnailSizes, setThumbnailSizes] = useState<{ [key: string]: { width: number, height: number } }>({});
  const [fullScreenImageSize, setFullScreenImageSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const checkCameraPermission = async () => {
      const granted = await requestCameraPermission();
      setHasCameraPermission(granted);
    };
    checkCameraPermission();
  }, []);

  useEffect(() => {
    images.flat().forEach(uri => {
      Image.getSize(`file://${uri}`, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        if (aspectRatio > 1) {
          // Landscape
          setThumbnailSizes(prev => ({ ...prev, [uri]: { width: 150, height: 150 / aspectRatio } }));
        } else {
          // Portrait
          setThumbnailSizes(prev => ({ ...prev, [uri]: { width: 150 * aspectRatio, height: 150 } }));
        }
      });
    });
  }, [images]);

  useEffect(() => {
    if (fullScreenImage) {
      Image.getSize(`file://${fullScreenImage.uri}`, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        if (aspectRatio > 1) {
          // Landscape
          setFullScreenImageSize({ width: 300, height: 300 / aspectRatio });
        } else {
          // Portrait
          setFullScreenImageSize({ width: 300 * aspectRatio, height: 300 });
        }
      });
    }
  }, [fullScreenImage]);

  const handleDeleteImage = () => {
    deleteImage(fullScreenImage, images, setImages, setFullScreenImage);
  };

  const handleOpenMailApp = () => {
    const email = emailAddress; // Use the set email address
    const subject = 'Installation Report'; // Replace with the desired subject
    const body = 'Attached are the installation images.'; // Replace with the desired body text
    const attachments = images.flat(); // Use the internal storage paths

    openMailApp(email, subject, body, attachments);
  };

  if (hasCameraPermission === null) {
    return (
      <SafeAreaView style={styles.permissionMessageContainer}>
        <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} />
        <View style={styles.permissionMessageContainer}>
          <Text style={styles.permissionMessageText}>Checking camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasCameraPermission) {
    return (
      <SafeAreaView style={styles.permissionMessageContainer}>
        <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} />
        <View style={styles.permissionMessageContainer}>
          <Text style={styles.permissionMessageText}>Camera permission is required to use this app.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getButtonBorderColor = (index: number) => {
    const imageCount = images[index].length;
    return imageCount > 0 ? 'green' : 'red';
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
      <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            navigation.navigate('Settings', { obliInstallEmail: emailAddress });
            navigation.setOptions({
              setObliInstallEmail: setEmailAddress,
            });
          }}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
        <ScrollView
          ref={scrollViewRef}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.buttonContainer}>
            {buttonNames.map((name, index) => (
              <View key={index} style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={[styles.button, { borderColor: getButtonBorderColor(index) }]}
                  onPress={() => openCamera(index, name, images, setImages)}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>{name}</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.thumbnailContainer}>
                  {images[index].map((uri, imgIndex) => {
                    console.log(`Rendering image for index ${index}: ${uri}`);
                    const thumbnailStyle = thumbnailSizes[uri];
                    return (
                      thumbnailStyle && (
                        <TouchableOpacity key={imgIndex} onPress={() => setFullScreenImage({ uri, index })}>
                          <Image
                            source={{ uri: `file://${uri}` }}
                            style={[styles.thumbnail, thumbnailStyle]}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      )
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={handleOpenMailApp}>
            <Text style={styles.bottomButtonText}>Send Email</Text>
          </TouchableOpacity>
        </View>
        {fullScreenImage && (
          <Modal
            visible={true}
            transparent={false}
            onRequestClose={() => setFullScreenImage(null)}>
            <TouchableOpacity style={styles.fullScreenContainer} onPress={() => setFullScreenImage(null)}>
              <Image
                source={{ uri: `file://${fullScreenImage.uri}` }}
                style={[styles.fullScreenImage, { width: fullScreenImageSize.width, height: fullScreenImageSize.height, borderColor: colors.primary, borderWidth: 2 }]}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ObliInstall;