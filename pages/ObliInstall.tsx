import React, { useState, useRef, useEffect, useContext } from 'react';
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
  Alert,
} from 'react-native';
import { useTheme } from '../ThemeContext'; // Import useTheme
import useStyles from '../styles'; // Use styles
import { openMailApp, handleOpenMailApp } from '../utils/emailUtils'; // Import emailUtils
import { openCamera } from '../utils/cameraUtils'; // Import camera utils
import { requestCameraPermission } from '../utils/permissionsUtils'; // Import permissions utils
import { deleteImage } from '../utils/imageUtils'; // Import image utils
import { useEmail } from '../EmailContext'; // Import useEmail
import { useRoute } from '@react-navigation/native'; // Import useRoute
import { StatusBarContext } from '../App'; // Import StatusBarContext

const ObliInstall = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme(); 
  const styles = useStyles();
  const scrollViewRef = useRef<ScrollView>(null);
  const { obliInstallEmail, setObliInstallEmail } = useEmail(); // Use email context
  const route = useRoute();
  type RouteParams = {
    vin?: string;
    reg?: string;
  };
  
  const { vin, reg } = (route.params as RouteParams) || {};
  const { setStatusBarColor, setNavigationBarColor } = useContext(StatusBarContext);

  useEffect(() => {
    setStatusBarColor(colors.primary);
    setNavigationBarColor(colors.primary);
  }, [colors, setStatusBarColor, setNavigationBarColor]);

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
    if (buttonNames[index] === 'Front Sensor(s)' || buttonNames[index] === 'Rear Sensor(s)') {
      return imageCount >= 2 ? 'green' : imageCount === 1 ? 'orange' : 'red';
    }
    return imageCount > 0 ? 'green' : (buttonNames[index] === 'T Piece Locations' || buttonNames[index] === 'Reg Plate' || buttonNames[index] === 'Other') ? 'orange' : 'red';
  };

  const handleDeleteImage = () => {
    deleteImage(fullScreenImage, images, setImages, setFullScreenImage);
  };

  const handleSend = () => {
    if (!vin || vin.length < 6 || vin.length > 17) {
      navigation.navigate('VinRegEntry', { images });
      return;
    }

    const email = obliInstallEmail;
    const subject = `${new Date().toISOString().split('T')[0]} ${vin} ${reg || ''}`;
    const body = 'Attached are the installation images.';
    const attachments = images.flat();

    openMailApp(email, subject, body, attachments);
  };

  const allButtonsGreenOrOrange = images.every((imageArray, index) => imageArray.length > 0 || getButtonBorderColor(index) === 'orange');
  const sendEmailButtonColor = allButtonsGreenOrOrange ? 'green' : 'red';

  // Separate green buttons and non-green buttons
  const nonGreenButtons = buttonNames
    .map((name, index) => ({ name, index, borderColor: getButtonBorderColor(index) }))
    .filter(button => button.borderColor !== 'green');

  const greenButtons = buttonNames
    .map((name, index) => ({ name, index, borderColor: getButtonBorderColor(index) }))
    .filter(button => button.borderColor === 'green');

  // Concatenate non-green buttons with green buttons at the end
  const sortedButtonNames = [...nonGreenButtons, ...greenButtons];

  return (
    <SafeAreaView style={{ backgroundColor: colors.secondary, flex: 1 }}>
      <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} backgroundColor={colors.primary} />
      <View style={[styles.container, { backgroundColor: colors.secondary }]}>
        
        <ScrollView
          ref={scrollViewRef}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.buttonContainer}>
            {sortedButtonNames.map(({ name, index, borderColor }) => (
              <View key={index} style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={[styles.bottomButton, { borderColor }]}
                  onPress={() => openCamera(index, name, images, setImages)}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>{name}</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.thumbnailContainer}>
                  {images[index].map((uri, imgIndex) => {
                    const thumbnailStyle = thumbnailSizes[uri];
                    return (
                      <View key={imgIndex} style={styles.thumbnailWrapper}>
                        {imageLoading[uri] && <ActivityIndicator size="small" color={colors.primary} />}
                        <TouchableOpacity onPress={() => setFullScreenImage({ uri, index })}>
                          <Image
                            source={{ uri: `file://${uri}` }}
                            style={[styles.thumbnail, thumbnailStyle]}
                            resizeMode="contain"
                            onLoad={() => {
                              setImageLoading(prev => ({ ...prev, [uri]: false }));
                            }}
                            onError={(error) => {
                              setImageLoading(prev => ({ ...prev, [uri]: false }));
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
            <View style={{ height: 250 }} /> 
          </View>
        </ScrollView>
        <View style={[styles.bottomButtonContainer, { backgroundColor: colors.primary }]}>
          <TouchableOpacity
            style={[styles.bottomButton, { borderColor: sendEmailButtonColor, borderWidth: 11, backgroundColor: colors.primary }]}
            onPress={handleSend}
          >
            <Text style={styles.bottomButtonText}>Send</Text>
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