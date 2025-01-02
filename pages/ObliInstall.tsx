import React, { useEffect, useRef, useContext, useState, useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text, TouchableOpacity, Image, ImageBackground, Modal, ActivityIndicator, StatusBarStyle, Dimensions, Alert } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBarContext } from '../App';
import SystemNavigationBar from 'react-native-system-navigation-bar'; // Import SystemNavigationBar
import { useTheme } from '../ThemeContext';
import useStyles from '../styles';
import { useEmail } from '../EmailContext';
import { requestCameraPermission, requestStoragePermissions } from '../utils/permissionsUtils';
import { openCamera } from '../utils/cameraUtils';
import { deleteImage } from '../utils/imageUtils';
import { getThumbnailStyle } from '../utils/thumbnailUtils'; // Import getThumbnailStyle
import SettingsButton from '../elements/SettingsButton';
import { handleOpenMailApp } from '../utils/emailUtils'; // Import handleOpenMailApp
import { getItem, setItem } from '../storage';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import FullScreenImageView from '../components/FullScreenImageView'; // Import FullScreenImageView

const ObliInstall = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();
  const styles = useStyles();
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
        backgroundColor: colors.primary, // Set the top navigation bar color
      },
      headerTintColor: colors.onPrimary, // Set the text color on the navigation bar to a lighter color
      headerRight: () => <SettingsButton />, // Use SettingsButton here
    });
  }, [nav, colors]);

  useFocusEffect(
    React.useCallback(() => {
      // Set the status bar color
      StatusBar.setBackgroundColor(colors.primary);
      StatusBar.setBarStyle(colors.statusBarStyle as StatusBarStyle);

      // Set the navigation bar color and button color
      SystemNavigationBar.setNavigationColor(colors.primary, undefined);

      const checkEmailAppOpened = async () => {
        const emailAppOpened = await getItem('emailAppOpened');
        if (emailAppOpened === 'true') {
          await setItem('emailAppOpened', 'false');
          navigation.navigate('ConfirmEmailPage', { vin, reg, emailAddress: obliInstallEmail, images, sourcePage: 'ObliInstall' });
        }
      };

      checkEmailAppOpened();
    }, [colors])
  );

  useEffect(() => {
    setStatusBarColor(colors.primary);
    setNavigationBarColor(colors.primary);
    changeNavigationBarColor(colors.primary, true);
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
  const [hasStoragePermissions, setHasStoragePermissions] = useState<boolean | null>(null);
  const [fullScreenImageSize, setFullScreenImageSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [fullScreenImageLoading, setFullScreenImageLoading] = useState<boolean>(false);
  const [componentHeights, setComponentHeights] = useState<number[]>([]);
  const [thumbnailStyles, setThumbnailStyles] = useState<{ [key: string]: any }>({});
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({}); // Define imageLoading state
  const [emailAddress, setEmailAddress] = useState('');
  const [thumbnailSizes, setThumbnailSizes] = useState<{ [key: string]: { width: number, height: number } }>({});

  useEffect(() => {
    const checkPermissions = async () => {
      const cameraGranted = await requestCameraPermission();
      const storageGranted = await requestStoragePermissions();
      setHasCameraPermission(cameraGranted);
      setHasStoragePermissions(storageGranted);
    };
    checkPermissions();
  }, []);

  useEffect(() => {
    images.flat().forEach(uri => {
      setImageLoading(prev => ({ ...prev, [uri]: true }));
      Image.getSize(`file://${uri}`, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        if (aspectRatio > 1) {
          // Landscape
          setThumbnailSizes(prev => ({ ...prev, [uri]: { width: 150, height: 150 / aspectRatio } }));
        } else {
          // Portrait
          setThumbnailSizes(prev => ({ ...prev, [uri]: { width: 150 * aspectRatio, height: 150 } }));
        }
        setImageLoading(prev => ({ ...prev, [uri]: false }));
      });
    });
  }, [images]);

  const getButtonBorderColor = (index: number) => {
    const imageCount = images[index].length;
    if (buttonNames[index] === 'Front Sensor(s)' || buttonNames[index] === 'Rear Sensor(s)') {
      return imageCount >= 2 ? 'green' : imageCount === 1 ? 'orange' : 'red';
    }
    return imageCount > 0 ? 'green' : (buttonNames[index] === 'T Piece Locations' || buttonNames[index] === 'Reg Plate' || buttonNames[index] === 'Other') ? 'orange' : 'red';
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

  const handleDeleteImage = (fullScreenImage: { uri: string; index: number; } | null, images: string[][] | undefined, setImages: ((images: string[][]) => void) | undefined, setFullScreenImage: ((image: { uri: string; index: number; } | null) => void) | undefined) => {
    deleteImage(fullScreenImage, images, setImages, setFullScreenImage);
  };

  const handleSend = async () => {
    const incompleteButtonIndex = buttonNames.findIndex((name, index) => images[index].length === 0 && getButtonBorderColor(index) === 'red');
    if (incompleteButtonIndex !== -1) {
      Alert.alert('Incomplete', `Please take a picture of ${buttonNames[incompleteButtonIndex]}.`);
      return;
    }

    if (!vin || vin.length < 6 || vin.length > 17) {
      navigation.navigate('VinRegEntry', { images, sourcePage: 'ObliInstall' });
      return;
    }

    const emailAddress = obliInstallEmail;
    if (!emailAddress) {
      Alert.alert('No Email Set', 'Please set an email address in the settings.', [
        { text: 'OK', onPress: () => navigation.navigate('Settings') },
      ]);
      return;
    }

    await handleOpenMailApp(vin, reg, emailAddress, buttonNames, images, getButtonBorderColor, navigation, 'ObliInstall');
  };

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
    <SafeAreaView style={{  flex: 1 }}>
      <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} backgroundColor={colors.primary} />
      <View style={styles.container}>
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
                    if (!thumbnailStyles[uri]) {
                      getThumbnailStyle(uri, (style) => {
                        setThumbnailStyles((prevStyles) => ({
                          ...prevStyles,
                          [uri]: style,
                        }));
                      });
                    }
                    const thumbnailStyle = thumbnailStyles[uri] || {};
                    return (
                      <View key={imgIndex} style={styles.thumbnailWrapper}>
                        {imageLoading[uri] && <ActivityIndicator size="small" color={colors.primary} />}
                        <TouchableOpacity onPress={() => setFullScreenImage({ uri, index })}>
                          <ImageBackground
                            source={{ uri: `file://${uri}` }}
                            style={[styles.thumbnail, thumbnailStyle]}
                            imageStyle={{ borderRadius: 20 }} // Ensure the image fits within the rounded border
                            onLoad={() => {
                              setImageLoading(prev => ({ ...prev, [uri]: false }));
                            }}
                            onError={(error) => {
                              setImageLoading(prev => ({ ...prev, [uri]: false }));
                            }}
                          >
                            {imageLoading[uri] && <ActivityIndicator size="small" color={colors.primary} />}
                          </ImageBackground>
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
            style={[
              styles.bottomButton,
              {
                borderColor: sendEmailButtonColor,
                backgroundColor: colors.primary,
                borderWidth: sendEmailButtonColor === 'green' ? 10 : 3, // Set border width conditionally
              },
            ]}
            onPress={handleSend}
          >
            <Text style={[styles.bottomButtonText, { color: colors.onPrimary }]}>Send</Text>
          </TouchableOpacity>
        </View>
        {fullScreenImage && (
          <FullScreenImageView
            visible={true}
            imageUri={`file://${fullScreenImage.uri}`}
            onClose={() => setFullScreenImage(null)}
            onDelete={() => handleDeleteImage(fullScreenImage, images, setImages, setFullScreenImage)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ObliInstall;