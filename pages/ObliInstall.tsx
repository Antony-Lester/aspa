import React, { useEffect, useRef, useContext, useState, useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, StatusBarStyle, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StatusBarContext } from '../App';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useTheme } from '../ThemeContext';
import useStyles from '../styles';
import { useEmail } from '../EmailContext';
import { requestCameraPermission } from '../utils/permissionsUtils';
import { openCamera } from '../utils/cameraUtils';
import { deleteImage } from '../utils/imageUtils';
import SettingsButton from '../elements/SettingsButton';

const ObliInstall = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const scrollViewRef = useRef<ScrollView>(null);
  const { obliInstallEmail } = useEmail();
  const route = useRoute();
  const nav = useNavigation();
  type RouteParams = {
    vin?: string;
    reg?: string;
  };

  const { vin, reg } = (route.params as RouteParams) || {};
  const { setStatusBarColor, setNavigationBarColor } = useContext(StatusBarContext);

  useLayoutEffect(() => {
    nav.setOptions({
      headerStyle: {
        backgroundColor: colors.tertiary, // Set the top navigation bar color
      },
      headerTintColor: colors.onTertiary, // Set the text color on the navigation bar
      headerRight: () => <SettingsButton />, // Use SettingsButton here
    });
  }, [nav, colors]);

  useEffect(() => {
    setStatusBarColor(colors.tertiary);
    setNavigationBarColor(colors.tertiary);
    changeNavigationBarColor(colors.tertiary, true);
    StatusBar.setBackgroundColor(colors.tertiary); // Set the notification bar color
    StatusBar.setBarStyle(colors.statusBarStyle as StatusBarStyle); // Set the status bar style
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
  const [fullScreenImage, setFullScreenImage] = useState<{ uri: string, index: number } | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [fullScreenImageSize, setFullScreenImageSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [fullScreenImageLoading, setFullScreenImageLoading] = useState<boolean>(false);
  const [componentHeights, setComponentHeights] = useState<number[]>([]);

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
      navigation.navigate('VinRegEntry', { images, sourcePage: 'ObliInstall' });
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

  const handleLayout = (event: any, index: number) => {
    const { height } = event.nativeEvent.layout;
    setComponentHeights(prevHeights => {
      const newHeights = [...prevHeights];
      newHeights[index] = height;
      return newHeights;
    });
  };

  const getSnapToOffsets = () => {
    let offsets = [];
    let currentOffset = 0;
    for (let height of componentHeights) {
      offsets.push(currentOffset);
      currentOffset += height;
    }
    return offsets;
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.secondary, flex: 1 }}>
      <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} backgroundColor={colors.tertiary} />
      <View style={[styles.container, { backgroundColor: colors.secondary }]}>
        <ScrollView
          ref={scrollViewRef}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          snapToOffsets={getSnapToOffsets()} // Ensure components are fully visible when scrolling stops
          snapToAlignment="start"
          decelerationRate="fast"
        >
          <View style={styles.buttonContainer}>
            {sortedButtonNames.map(({ name, index, borderColor }) => (
              <View key={index} style={styles.buttonWrapper} onLayout={(event) => handleLayout(event, index)}>
                <TouchableOpacity
                  style={[styles.button, { borderColor }]}
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
            <View style={{ height: 50 }} />
          </View>
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.bottomButton}
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