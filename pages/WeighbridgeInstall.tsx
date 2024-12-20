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
import useStyles from '../styles'; // Import useStyles
import { openMailApp } from '../utils/emailUtils'; // Adjust the import path as necessary
import { requestCameraPermission, openCamera } from '../utils/cameraUtils'; // Import camera utils
import { deleteImage } from '../utils/imageUtils'; // Import image utils

const WeighbridgeInstall = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(); // Use styles
  const scrollViewRef = useRef<ScrollView>(null);

  const [images, setImages] = useState<string[][]>(Array(5).fill([]));
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
    const subject = 'Weighbridge Install Report'; // Replace with the desired subject
    const body = 'Attached are the weighbridge install images.'; // Replace with the desired body text

    openMailApp(email, subject, body);
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

  const buttonNames = [
    'Beam Approach',
    'Beam',
    'Pillar',
    'Enclosures',
    'LRD',
  ];

  const getButtonBorderColor = (index: number) => {
    const imageCount = images[index].length;
    return imageCount > 0 ? 'green' : 'red';
  };

  const buttons = buttonNames.map((name, index) => ({
    name,
    index,
    borderColor: getButtonBorderColor(index),
  }));

  return (
    <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
      <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings', { weighbridgeInstallEmail: emailAddress, setWeighbridgeInstallEmail: setEmailAddress })}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
        <ScrollView
          ref={scrollViewRef}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.buttonContainer}>
            {buttons.map(button => (
              <View key={button.index} style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={[styles.button, { borderColor: button.borderColor }]}
                  onPress={() => openCamera(button.index, images, setImages)}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>{button.name}</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.thumbnailContainer}>
                  {images[button.index].map((uri, imgIndex) => (
                    <TouchableOpacity key={imgIndex} onPress={() => setFullScreenImage({ uri, index: button.index })}>
                      <Image
                        source={{ uri: uri }}
                        style={styles.thumbnail}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  ))}
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
                source={{ uri: fullScreenImage.uri }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setFullScreenImage(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WeighbridgeInstall;