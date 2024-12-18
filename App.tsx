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
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { launchCamera } from 'react-native-image-picker';
import email from 'react-native-email';
import { useColorScheme } from 'react-native';
import SettingsScreen from './SettingsScreen';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const scrollViewRef = useRef<ScrollView>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
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
  const [emailAddress, setEmailAddress] = useState('atluk87@gmail.com');

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
    const redButton = buttons.find(button => button.borderColor === 'red');
    if (redButton) {
      Alert.alert('Incomplete', `A picture needs to be taken of ${redButton.name}`);
    } else {
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
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
          style={backgroundStyle}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.0)', // Translucent background
    borderRadius: 5,
    zIndex: 1,
  },
  settingsButtonText: {
    fontSize: 35,
    color: '#fff',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50, // Add 10 more padding to the top
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: '90%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#6200ee',
    borderRadius: 25,
    borderWidth: 3, // Increase border width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  plusIcon: {
    color: '#fff',
    fontSize: 24,
    marginRight: 10,
  },
  plusIconPlaceholder: {
    width: 24, // Same width as the plus icon
    height: 32, // Same height as the plus icon
    marginRight: 10,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 20,
  },
  bottomButtonContainer: {
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  bottomButton: {
    width: '90%',
    padding: 20, // Increase padding
    backgroundColor: '#ff5722', // Change background color to a more prominent color
    borderRadius: 30, // Increase border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Increase shadow offset
    shadowOpacity: 0.9, // Increase shadow opacity
    shadowRadius: 4, // Increase shadow radius
    elevation: 10, // Increase elevation
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18, // Increase font size
    fontWeight: 'bold', // Make text bold
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
    borderRadius: 50,
  },
  deleteButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
