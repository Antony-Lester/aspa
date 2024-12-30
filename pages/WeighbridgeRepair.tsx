import React, { useEffect, useRef, useContext, useState, useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text, TouchableOpacity, Image, ImageBackground, Modal, ActivityIndicator, StatusBarStyle, Dimensions, Alert } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBarContext } from '../App';
import SystemNavigationBar from 'react-native-system-navigation-bar'; // Import SystemNavigationBar
import { useTheme } from '../ThemeContext';
import useStyles from '../styles';
import { useEmail } from '../EmailContext';
import { requestCameraPermission } from '../utils/permissionsUtils';
import { openCamera } from '../utils/cameraUtils';
import { deleteImage } from '../utils/imageUtils';
import { getThumbnailStyle } from '../utils/thumbnailUtils'; // Import getThumbnailStyle
import SettingsButton from '../elements/SettingsButton';

const WeighbridgeRepair = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const scrollViewRef = useRef<ScrollView>(null);
  const { weighbridgeRepairEmail } = useEmail();
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
      SystemNavigationBar.setNavigationColor(colors.primary, true);
    }, [colors])
  );

  useEffect(() => {
    setStatusBarColor(colors.primary);
    setNavigationBarColor(colors.primary);
  }, [colors, setStatusBarColor, setNavigationBarColor]);

  const buttonNames = [
    'Before Repair',
    'After Repair',
    'Other',
  ];

  const [images, setImages] = useState<string[][]>(Array(buttonNames.length).fill([]));
  const [fullScreenImage, setFullScreenImage] = useState<{ uri: string, index: number } | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [fullScreenImageSize, setFullScreenImageSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [fullScreenImageLoading, setFullScreenImageLoading] = useState<boolean>(false);
  const [componentHeights, setComponentHeights] = useState<number[]>([]);
  const [thumbnailStyles, setThumbnailStyles] = useState<{ [key: string]: any }>({});
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({}); // Define imageLoading state

  useEffect(() => {
    const checkCameraPermission = async () => {
      const granted = await requestCameraPermission();
      setHasCameraPermission(granted);
    };
    checkCameraPermission();
  }, []);

  const getButtonBorderColor = (index: number) => {
    const imageCount = images[index].length;
    if (buttonNames[index] === 'Other') {
      return imageCount > 0 ? 'green' : 'orange';
    }
    return imageCount > 0 ? 'green' : 'red';
  };

  const allButtonsGreenOrOrange = images.every((imageArray, index) => imageArray.length > 0 || buttonNames[index] === 'Other');
  const sendEmailButtonColor = allButtonsGreenOrOrange ? 'green' : 'red';

  const handleDeleteImage = () => {
    deleteImage(fullScreenImage, images, setImages, setFullScreenImage);
  };

  const handleSend = () => {
    const missingImageIndex = buttonNames.findIndex((_, index) => images[index].length === 0 && buttonNames[index] !== 'Other');

    if (missingImageIndex !== -1) {
      Alert.alert(
        'Incomplete Images',
        `Please take a picture for the following button: ${buttonNames[missingImageIndex]}.`,
      );
      return;
    }

    if (!vin || vin.length < 6 || vin.length > 17) {
      navigation.navigate('VinRegEntry', { images, sourcePage: 'WeighbridgeRepair' });
      return;
    }

    const email = weighbridgeRepairEmail;
    const subject = `${new Date().toISOString().split('T')[0]} ${vin} ${reg || ''}`;
    const body = 'Attached are the repair images.';
    const attachments = images.flat();

    openMailApp(email, subject, body, attachments);
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
    <SafeAreaView style={{ flex: 1 }}>
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
            {buttonNames.map((name, index) => (
              <View key={index} style={styles.buttonWrapper} onLayout={(event) => handleLayout(event, index)}>
                <TouchableOpacity
                  style={[styles.button, { borderColor: getButtonBorderColor(index) }]}
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

export default WeighbridgeRepair;