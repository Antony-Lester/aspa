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

  useEffect(() => {
    const checkCameraPermission = async () => {
      const granted = await requestCameraPermission();
      setHasCameraPermission(granted);
    };
    checkCameraPermission();
  }, []);

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

  const checkImageExistenceAndSize = async (uri: string) => {
    try {
      const exists = await RNFS.exists(uri);
      console.log(`Image exists at ${uri}: ${exists}`);
      if (exists) {
        const stat = await RNFS.stat(uri);
        console.log(`Image size at ${uri}: ${stat.size} bytes`);
      }
      return exists;
    } catch (error) {
      console.error(`Error checking image existence and size at ${uri}:`, error);
      return false;
    }
  };

  if (hasCameraPermission === null) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
        <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} />
        <View style={styles.container}>
          <Text style={styles.buttonText}>Checking camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasCameraPermission) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
        <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} />
        <View style={styles.container}>
          <Text style={styles.buttonText}>Camera permission is required to use this app.</Text>
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
                    checkImageExistenceAndSize(uri);
                    console.log(`Rendering image for index ${index}: ${uri}`);
                    return (
                      <TouchableOpacity key={imgIndex} onPress={() => setFullScreenImage({ uri, index })}>
                        <Image
                          source={{ uri: `file://${uri}` }}
                          style={styles.thumbnail}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
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
            <View style={styles.fullScreenContainer}>
              <Image
                source={{ uri: `file://${fullScreenImage.uri}` }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ObliInstall;