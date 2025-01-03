import React, { useEffect, useRef, useContext, useState, useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text, TouchableOpacity, ImageBackground, ActivityIndicator, StatusBarStyle, Alert } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import { StatusBarContext } from '../App';
import { getItem, setItem } from '../storage';
import { useTheme } from '../ThemeContext';
import { useEmail } from '../EmailContext';
import useStyles from '../styles';

import SettingsButton from '../elements/SettingsButton';
import FullScreenImageView from '../components/FullScreenImageView';

import { requestCameraPermission } from '../utils/permissionsUtils';
import { openCamera } from '../utils/cameraUtils';
import { deleteImage } from '../utils/imageUtils';
import { getThumbnailStyle } from '../utils/thumbnailUtils';
import { handleOpenMailApp } from '../utils/emailUtils';

type RouteParams = { vin?: string; reg?: string; };

const ObliRepair = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const scrollViewRef = useRef<ScrollView>(null);
  const { obliRepairEmail } = useEmail();
  const route = useRoute();
  const nav = useNavigation();
  const { setStatusBarColor, setNavigationBarColor } = useContext(StatusBarContext);

  const { vin, reg } = (route.params as RouteParams) || {};
  const detectedVin = getItem('detectedVin');
  const detectedReg = getItem('detectedReg');

  useLayoutEffect(() => {
    nav.setOptions({
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.onPrimary, headerRight: () => <SettingsButton />
    });
  }, [nav, colors]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor(colors.primary);
      StatusBar.setBarStyle(colors.statusBarStyle as StatusBarStyle);
      SystemNavigationBar.setNavigationColor(colors.primary, undefined);
      const checkEmailAppOpened = async () => {
        if (getItem('emailAppOpened') === 'true') {
          setItem('emailAppOpened', 'false');
          navigation.navigate('ConfirmEmailPage', { vin, reg, emailAddress: obliRepairEmail, images, sourcePage: 'ObliRepair' })
        }
      };
      checkEmailAppOpened();
    }, [colors])
  );

  useEffect(() => {
    setStatusBarColor(colors.primary);
    setNavigationBarColor(colors.primary);
  }, [colors, setStatusBarColor, setNavigationBarColor]);

  const buttonNames = ['Before Repair', 'After Repair', 'Chassis Plate',
    'Reg Plate',
  ];

  const [images, setImages] = useState<string[][]>(Array(buttonNames.length).fill([]));
  const [fullScreenImage, setFullScreenImage] = useState<{ uri: string, index: number } | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
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
    if (buttonNames[index] === 'Reg Plate') { return imageCount > 0 ? 'green' : 'orange'; }
    return imageCount > 0 ? 'green' : 'red';
  };

  const handleOpenCamera = async (index: number) => {
    if (!hasCameraPermission) {
      Alert.alert('Camera Permission', 'Camera permission is required to take pictures.');
      return;
    }
    const imageUri = await openCamera(index, buttonNames[index], images, setImages);
    if (typeof imageUri === 'string' && imageUri) {
      setImages(prevImages => {
        const newImages = [...prevImages];
        newImages[index] = [...newImages[index], imageUri];
        return newImages;
      });
    }
  };

  const handleDeleteImage = async (imageUri: string, index: number) => { await deleteImage({ uri: imageUri, index }, images, setImages) };

  const handleSend = () => {
    const incompleteButtonIndex = buttonNames.findIndex((name, index) => images[index].length === 0 && getButtonBorderColor(index) === 'red')
    if (incompleteButtonIndex !== -1) {
      Alert.alert('Incomplete', `Please take a picture of ${buttonNames[incompleteButtonIndex]}.`); return;
    }

    if (!vin || vin.length < 6 || vin.length > 17) {
      navigation.navigate('VinRegEntry', { images, sourcePage: 'ObliRepair' }); return;
    }
    handleOpenMailApp(vin, reg, obliRepairEmail, buttonNames, images, getButtonBorderColor, navigation, 'ObliRepair');
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
    const offsets = [];
    let currentOffset = 0;
    for (const height of componentHeights) {
      offsets.push(currentOffset);
      currentOffset += height;
    }
    return offsets;
  };

  const isAnyButtonRed = buttonNames.some((name, index) => getButtonBorderColor(index) === 'red');
  const sendEmailButtonColor = isAnyButtonRed ? 'red' : 'green';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} backgroundColor={colors.primary} />
      <View style={styles.container}>
        <ScrollView ref={scrollViewRef} contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}
          snapToOffsets={getSnapToOffsets()} snapToAlignment="start" decelerationRate="fast">
          <View style={styles.buttonContainer}>
            {buttonNames.map((name, index) => (
              <View key={index} style={styles.buttonWrapper} onLayout={(event) => handleLayout(event, index)}>
                <TouchableOpacity style={[styles.button, { borderColor: getButtonBorderColor(index) }]} onPress={() => handleOpenCamera}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>
                      {name === 'Chassis Plate' && detectedVin ? detectedVin : name === 'Reg Plate' && detectedReg ? detectedReg : name}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.thumbnailContainer}>
                  {images[index].map((uri, imgIndex) => {
                    if (!thumbnailStyles[uri]) {
                      getThumbnailStyle(uri, (style) => { setThumbnailStyles((prevStyles) => ({ ...prevStyles, [uri]: style })) })
                    }
                    const thumbnailStyle = thumbnailStyles[uri] || {};
                    return (
                      <View key={imgIndex} style={styles.thumbnailWrapper}>
                        {imageLoading[uri] && <ActivityIndicator size="small" color={colors.primary} />}
                        <TouchableOpacity onPress={() => setFullScreenImage({ uri, index })}>
                          <ImageBackground source={{ uri: `file://${uri}` }} style={[styles.thumbnail, thumbnailStyle]}
                            imageStyle={{ borderRadius: 20 }}
                            onLoad={() => { setImageLoading(prev => ({ ...prev, [uri]: false })); }}
                            onError={(error) => { setImageLoading(prev => ({ ...prev, [uri]: false })); }}>
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
            style={[styles.bottomButton, {
              borderColor: sendEmailButtonColor, backgroundColor: colors.primary,
              borderWidth: sendEmailButtonColor === 'green' ? 10 : 3
            }]} onPress={handleSend}>
            <Text style={[styles.bottomButtonText, { color: colors.onPrimary }]}>Send</Text>
          </TouchableOpacity>
        </View>
        {fullScreenImage && (
          <FullScreenImageView visible={true} imageUri={`file://${fullScreenImage.uri}`} onClose={() => setFullScreenImage(null)}
            onDelete={() => handleDeleteImage(fullScreenImage.uri, fullScreenImage.index)} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ObliRepair;