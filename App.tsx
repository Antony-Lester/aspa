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
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { launchCamera } from 'react-native-image-picker';
import { useColorScheme } from 'react-native';
import SettingsScreen from './pages/SettingsScreen'; // Updated import path
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider and useTheme
import useStyles from './styles'; // Import useStyles

const Stack = createStackNavigator();

const ObliInstalls = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(); // Use styles
  const scrollViewRef = useRef<ScrollView>(null);

  const backgroundStyle = {
    backgroundColor: colors.background, // Ensure background color is consistent
    flex: 1,
  };

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

  const getButtonBorderColor = (index: number) => {
    const name = buttonNames[index];
    const imageCount = images[index].length;

    if (imageCount === 0) {
      if (name === 'T Piece Locations' || name === 'Reg Plate' || name === 'Other') {
        return colors.amber;
      }
      return 'red';
    } else if (imageCount === 1) {
      if (name === 'Front Sensor(s)' || name === 'Rear Sensor(s)') {
        return colors.amber;
      }
      return 'green';
    } else if (imageCount >= 2) {
      if (name === 'Front Sensor(s)' || name === 'Rear Sensor(s)') {
        return 'green';
      }
    }
    return 'green';
  };

  const [images, setImages] = useState<string[][]>(Array(buttonNames.length).fill([]));
  const [fullScreenImage, setFullScreenImage] = useState<{ uri: string, index: number } | null>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestCameraPermission();
      setHasCameraPermission(granted);
      if (!granted) {
        Alert.alert('Camera Permission Denied', 'Please grant camera permission to use this app.');
      }
    };
    checkPermission();
  }, []);

  const openCamera = async (index: number) => {
    if (!hasCameraPermission) {
      Alert.alert('Camera Permission Denied', 'Please grant camera permission to use this feature.');
      return;
    }

    const options = {
      mediaType: 'photo' as const,
      cameraType: 'back' as const,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const newImages = [...images];
          if (response.assets[0].uri) {
            newImages[index] = [...newImages[index], response.assets[0].uri];
          }
          setImages(newImages);
        }
      }
    });
  };

  const deleteImage = () => {
    if (fullScreenImage) {
      const newImages = [...images];
      newImages[fullScreenImage.index] = newImages[fullScreenImage.index].filter(uri => uri !== fullScreenImage.uri);
      setImages(newImages);
      setFullScreenImage(null);
    }
  };

  const openMailApp = () => {
    const email = 'example@example.com'; // Replace with the desired email address
    const subject = 'Subject'; // Replace with the desired subject
    const body = 'Body'; // Replace with the desired body text

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl).catch((err) => {
      console.error('Failed to open mail app:', err);
    });
  };

  if (hasCameraPermission === null) {
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={colors.statusBarStyle} />
        <View style={styles.container}>
          <Text style={styles.buttonText}>Checking camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasCameraPermission) {
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={colors.statusBarStyle} />
        <View style={styles.container}>
          <Text style={styles.buttonText}>Camera permission is required to use this app.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const buttons = buttonNames.map((name, index) => ({
    name,
    index,
    borderColor: getButtonBorderColor(index),
  }));

  const greenButtons = buttons.filter(button => button.borderColor === 'green');
  const otherButtons = buttons.filter(button => button.borderColor !== 'green');

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings', { email: emailAddress, setEmail: setEmailAddress })}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
        <ScrollView
          ref={scrollViewRef}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.buttonContainer}>
            {[...otherButtons, ...greenButtons].map(button => (
              <View key={button.index} style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={[styles.button, { borderColor: button.borderColor }]}
                  onPress={() => openCamera(button.index)}>
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
            onPress={openMailApp}>
            <Text style={styles.bottomButtonText}>Send Email</Text>
          </TouchableOpacity>
        </View>
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
            <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setFullScreenImage(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ObliInstalls">
          <Stack.Screen
            name="ObliInstalls"
            component={ObliInstalls}
            options={{ headerShown: false }} // Hide the header for the ObliInstalls screen
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;