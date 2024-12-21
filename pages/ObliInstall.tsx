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
  StatusBarStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../ThemeContext'; // Import useTheme
import useStyles from '../styles'; // Use styles
import { openMailApp } from '../utils/emailUtils'; // Adjust the import path as necessary
import { openCamera } from '../utils/cameraUtils'; // Import camera utils
import { requestCameraPermission } from '../utils/permissionsUtils'; // Import permissions utils
import { deleteImage } from '../utils/imageUtils'; // Import image utils

const ObliInstall = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme(); 
  const styles = useStyles();
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
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});
  const [fullScreenImage, setFullScreenImage] = useState<{ uri: string, index: number } | null>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [thumbnailSizes, setThumbnailSizes] = useState<{ [key: string]: { width: number, height: number } }>({});
  const [fullScreenImageSize, setFullScreenImageSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [fullScreenImageLoading, setFullScreenImageLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const granted = await requestCameraPermission();
      setHasCameraPermission(granted);
    };
    checkCameraPermission();
  }, []);

  const getButtonBorderColor = (index: number) => {
    const imageCount = images[index].length;
    return imageCount > 0 ? 'green' : (buttonNames[index] === 'T Piece Locations' || buttonNames[index] === 'Reg Plate' || buttonNames[index] === 'Other') ? 'orange' : 'red';
  };

  const handleDeleteImage = () => {
    deleteImage(fullScreenImage, images, setImages, setFullScreenImage);
  };

  const handleOpenMailApp = () => {
    const email = emailAddress;
    const subject = 'Installation Report';
    const body = 'Attached are the installation images.'; 
    const attachments = images.flat();

    openMailApp(email, subject, body, attachments);
  };

  const allButtonsGreen = images.every(imageArray => imageArray.length > 0);
  const sendEmailButtonColor = allButtonsGreen ? 'green' : 'red';

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
                      thumbnailStyle && !imageLoading[uri] ? (
                        <TouchableOpacity key={imgIndex} onPress={() => setFullScreenImage({ uri, index })}>
                          <Image
                            source={{ uri: `file://${uri}` }}
                            style={[styles.thumbnail, thumbnailStyle]}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      ) : (
                        <ActivityIndicator key={imgIndex} size="small" color={colors.primary} />
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
            style={[styles.bottomButton, { backgroundColor: sendEmailButtonColor }]}
            onPress={handleOpenMailApp}
            disabled={!allButtonsGreen}
          >
            <Text style={styles.bottomButtonText}>Send Email</Text>
          </TouchableOpacity>
        </View>
        {fullScreenImage && (
          <Modal
            visible={true}
            transparent={false}
            onRequestClose={() => setFullScreenImage(null)}>
            <TouchableOpacity style={styles.fullScreenContainer} onPress={() => setFullScreenImage(null)}>
              {fullScreenImageLoading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <Image
                  source={{ uri: `file://${fullScreenImage.uri}` }}
                  style={[styles.fullScreenImage, { width: fullScreenImageSize.width, height: fullScreenImageSize.height, borderColor: colors.primary, borderWidth: 2 }]}
                  resizeMode="contain"
                />
              )}
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