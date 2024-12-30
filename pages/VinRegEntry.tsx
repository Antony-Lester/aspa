// VinRegEntry.tsx
import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  StatusBarStyle,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import useStyles from '../styles'; // Import useStyles
import { handleOpenMailApp } from '../utils/emailUtils'; // Import handleOpenMailApp
import { deleteImage } from '../utils/imageUtils'; // Import deleteImage
import { useEmail } from '../EmailContext'; // Import useEmail
import { StatusBarContext } from '../App'; // Import StatusBarContext
import SystemNavigationBar from 'react-native-system-navigation-bar'; // Import SystemNavigationBar
import SettingsButton from '../elements/SettingsButton'; // Import SettingsButton
import { useTheme } from '../ThemeContext'; // Import useTheme
import { useImages } from '../ImagesContext'; // Import useImages
import { setItem, getItem } from '../storage';

import { NavigationProp, RouteProp } from '@react-navigation/native';

type VinRegEntryProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { images: string[][]; sourcePage: string } }, 'params'>;
};

const VinRegEntry = ({ navigation, route }: VinRegEntryProps) => {
  const { images: routeImages, sourcePage } = route.params || {};
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(); // Use styles
  const { obliInstallEmail, obliRepairEmail, weighbridgeRepairEmail, weighbridgeInstallEmail } = useEmail(); // Use email context
  const { images, setImages } = useImages(); // Use images from context
  const [vin, setVin] = useState('');
  const [reg, setReg] = useState('');
  const [emailOpened, setEmailOpened] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // Flag to check if the email has been sent
  const [chassisPlateUri, setChassisPlateUri] = useState('');
  const [sendEmailButtonColor, setSendEmailButtonColor] = useState('red');
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const { setStatusBarColor, setNavigationBarColor } = useContext(StatusBarContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.primary, // Set the top navigation bar color
      },
      headerTintColor: colors.onPrimary, // Set the text color on the navigation bar to a lighter color
      headerRight: () => <SettingsButton />, // Use SettingsButton here
    });
  }, [navigation, colors]);

  useFocusEffect(
    React.useCallback(() => {
      // Set the status bar color
      StatusBar.setBackgroundColor(colors.primary);
      StatusBar.setBarStyle(colors.statusBarStyle as StatusBarStyle);

      // Set the navigation bar color and button color
      SystemNavigationBar.setNavigationColor(colors.primary, undefined);
    }, [colors])
  );

  useEffect(() => {
    setStatusBarColor(colors.primary);
    setNavigationBarColor(colors.primary);
  }, [colors, setStatusBarColor, setNavigationBarColor]);

  useEffect(() => {
    // Suggest VIN and REG based on images
    const suggestVinAndReg = async () => {
      // Identify the Chassis plate image based on the tag
      for (const imageArray of images) {
        for (const imageUri of imageArray) {
          // Your existing logic here...
        }
      }
    };

    suggestVinAndReg();
  }, [images]);

  useEffect(() => {
    // Validate VIN or Service Call and set button color
    const isValidVinOrServiceCall = sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall'
      ? vin.replace(/\s/g, '').length === 6
      : vin.replace(/\s/g, '').length >= 6 && vin.replace(/\s/g, '').length <= 17;
    setSendEmailButtonColor(isValidVinOrServiceCall ? 'green' : 'red');
  }, [vin, sourcePage]);

  const getEmailAddress = () => {
    switch (sourcePage) {
      case 'ObliInstall':
        return obliInstallEmail;
      case 'ObliRepair':
        return obliRepairEmail;
      case 'WeighbridgeInstall':
        return weighbridgeInstallEmail;
      case 'WeighbridgeRepair':
        return weighbridgeRepairEmail;
      default:
        return '';
    }
  };

  const handleDeleteAllImages = async () => {
    console.log('Deleting all images...');
    for (const imageArray of images) {
      for (const imageUri of imageArray) {
        await deleteImage({ uri: imageUri, index: images.indexOf(imageArray) }, images, setImages);
      }
    }
    console.log('All images deleted.');
    // Navigate to Home screen
    navigation.navigate('Home');
  };

  useFocusEffect(
    React.useCallback(() => {
      const showAlert = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
        const emailAddress = getEmailAddress();
        console.log('Checking if alert should be shown...');
        console.log('emailOpened:', emailOpened);
        console.log('emailSent:', emailSent);
        console.log('emailAddress:', emailAddress);
        if (!emailOpened && !emailSent && emailAddress) {
          Alert.alert(
            'Send Email',
            `Do you want to send the images to ${emailAddress}?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  setEmailOpened(true);
                  // Logic to send email
                },
              },
            ],
            { cancelable: false }
          );
        }
      };

      showAlert();
    }, [emailOpened, emailSent, getEmailAddress])
  );

  const handleSave = async () => {
    const formattedVinOrServiceCall = vin.replace(/\s/g, ''); // Remove spaces from VIN or Service Call
    if ((sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall') && formattedVinOrServiceCall.length !== 6) {
      Alert.alert('Invalid Service Call', 'Please enter a valid Service Call number.');
      return;
    } else if (formattedVinOrServiceCall.length < 6 || formattedVinOrServiceCall.length > 17) {
      Alert.alert('Invalid VIN', 'Please enter a valid VIN number.');
      return;
    }

    const emailAddress = getEmailAddress();
    if (!emailAddress) {
      Alert.alert('No Email Set', 'Please set an email address in the settings.', [
        { text: 'OK', onPress: () => navigation.navigate('Settings') },
      ]);
      return;
    }

    // Handle save logic with formatted VIN or Service Call
    console.log('Formatted VIN or Service Call:', formattedVinOrServiceCall);

    let subject = `${new Date().toISOString().split('T')[0]} ${vin} ${reg || ''}`;
    let body = 'Attached are the images.';
    if (sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall') {
      subject = `${new Date().toISOString().split('T')[0]} SC${formattedVinOrServiceCall}` + (reg ? ` S/N${reg}` : '');
      body = `Attached are the images for SC${formattedVinOrServiceCall}` + (reg ? ` S/N${reg}` : '');
    }

    await handleOpenMailApp(formattedVinOrServiceCall, reg, emailAddress, ['Chassis Plate', 'Reg Plate'], images, () => 'green', navigation, sourcePage);
    setEmailSent(true); // Set emailSent to true after sending the email
    setEmailOpened(true); // Set emailOpened to true to show the alert
    console.log('Email sent and navigating to confirmation page.');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay before navigating
    navigation.navigate('ConfirmEmailPage', { vin: formattedVinOrServiceCall, reg, emailAddress, images, sourcePage });
  };

  const handleImageLayout = (event: { nativeEvent: { layout: { width: any; height: any; }; }; }) => {
    const { width, height } = event.nativeEvent.layout;
    setImageAspectRatio(width / height);
  };

  useEffect(() => {
    const loadSettings = () => {
      const storedVin = getItem('vin');
      const storedReg = getItem('reg');
      if (storedVin) setVin(storedVin);
      if (storedReg) setReg(storedReg);
    };

    loadSettings();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>VIN:</Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={setVin}
            placeholder="Enter VIN"
            placeholderTextColor="gray"
          />
          <Text style={styles.label}>Registration:</Text>
          <TextInput
            style={styles.input}
            value={reg}
            onChangeText={setReg}
            placeholder="Enter Registration"
            placeholderTextColor="gray"
          />
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: sendEmailButtonColor }]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VinRegEntry;