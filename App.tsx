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
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { launchCamera } from 'react-native-image-picker';
import email from 'react-native-email';
import { useColorScheme } from 'react-native';
import SettingsScreen from './SettingsScreen';
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider and useTheme
import useStyles from './styles'; // Import useStyles

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(); // Use styles
  const isDarkMode = useColorScheme() === 'dark';
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

  const [images, setImages] = useState<string[][]>(Array(buttonNames.length).fill([]));
  const [fullScreenImage, setFullScreenImage] = useState<{ uri: string, index: number } | null>(null);
  const [emailAddress, setEmailAddress] = useState('');

  const openCamera = (index: number) => {
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

  const getButtonBorderColor = (index: number) => {
    if (buttonNames[index] === 'Front Sensor(s)' || buttonNames[index] === 'Rear Sensor(s)') {
      if (images[index].length >= 2) {
        return 'green';
      } else if (images[index].length === 1) {
        return 'orange';
      } else {
        return 'red';
      }
    } else if (images[index].length > 0) {
      return 'green';
    } else if (buttonNames[index] === 'Reg Plate' || buttonNames[index] === 'T Piece Locations' || buttonNames[index] === 'Other') {
      return 'orange';
    } else {
      return 'red';
    }
  };

  const buttons = buttonNames.map((name, index) => ({
    name,
    index,
    borderColor: getButtonBorderColor(index),
  }));

  const greenButtons = buttons.filter(button => button.borderColor === 'green');
  const otherButtons = buttons.filter(button => button.borderColor !== 'green');

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [greenButtons.length, otherButtons.length]);

  const handleSendPress = () => {
    if (!emailAddress) {
      Alert.alert(
        'No Email Set',
        'Please set your email address in the settings.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Settings', { email: emailAddress }),
          },
        ],
        { cancelable: false }
      );
    } else {
      const redButton = buttons.find(button => button.borderColor === 'red');
      if (redButton) {
        Alert.alert('Incomplete', `A picture needs to be taken of ${redButton.name}`);
      } else {
        Alert.alert(
          'Ready to Send',
          'Are you ready to send the email?',
          [
            {
              text: 'No',
              onPress: () => console.log('Email not sent'),
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                const attachments = images.flat().map(uri => ({ path: uri }));
                email(emailAddress, {
                  subject: 'Pictures',
                  body: 'Please find the attached pictures.',
                  attachments,
                }).then(() => {
                  Alert.alert(
                    'Email Sent',
                    'Have you sent the email?',
                    [
                      {
                        text: 'No',
                        onPress: () => console.log('Email not sent'),
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: () => setImages(Array(buttonNames.length).fill([])),
                      },
                    ],
                    { cancelable: false }
                  );
                }).catch((error) => {
                  console.error(error);
                  Alert.alert('Error', 'Failed to send email');
                });
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings', { email: emailAddress })}
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
                  onPress={() => openCamera(button.index)}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>{button.name}</Text>
                    {button.borderColor === 'red' ? (
                      <Text style={styles.plusIcon}>+</Text>
                    ) : (
                      <View style={styles.plusIconPlaceholder} />
                    )}
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
            onPress={handleSendPress}>
            <Text style={styles.bottomButtonText}>Send</Text>
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
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }} // Hide the header for the Home screen
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;