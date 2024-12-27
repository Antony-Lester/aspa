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
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import useStyles from '../styles'; // Import useStyles
import { handleOpenMailApp } from '../utils/emailUtils'; // Import handleOpenMailApp
import { deleteImage } from '../utils/imageUtils'; // Import deleteImage
import { useEmail } from '../EmailContext'; // Import useEmail
import { StatusBarContext } from '../App'; // Import StatusBarContext
import SystemNavigationBar from 'react-native-system-navigation-bar'; // Import SystemNavigationBar
import SettingsButton from '../elements/SettingsButton'; // Import SettingsButton
import { useTheme } from '../ThemeContext'; // Import useTheme

import { NavigationProp, RouteProp } from '@react-navigation/native';

type VinRegEntryProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { images: string[][]; sourcePage: string } }, 'params'>;
};

const VinRegEntry = ({ navigation, route }: VinRegEntryProps) => {
  const { images, sourcePage } = route.params || {};
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(colors);
  const { obliInstallEmail, obliRepairEmail, weighbridgeRepairEmail, weighbridgeInstallEmail } = useEmail(); // Use email context
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
      SystemNavigationBar.setNavigationColor(colors.primary, true);
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
        await deleteImage({ uri: imageUri, index: images.indexOf(imageArray) }, images, setImages, setFullScreenImage);
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
  };

  const handleImageLayout = (event: { nativeEvent: { layout: { width: any; height: any; }; }; }) => {
    const { width, height } = event.nativeEvent.layout;
    setImageAspectRatio(width / height);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {chassisPlateUri ? (
          <Image
            source={{ uri: `file://${chassisPlateUri}` }}
            style={[
              styles.chassisPlateImage,
              imageAspectRatio ? { aspectRatio: imageAspectRatio } : {},
            ]}
            resizeMode="contain"
            onLayout={handleImageLayout}
          />
        ) : null}
        <Text style={styles.vinLabel}>
          {sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall' ? 'Enter Service Call:' : 'Enter VIN:'}
        </Text>
        <TextInput
          style={styles.vinInput}
          value={vin}
          onChangeText={setVin}
          placeholder={sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall' ? 'Enter Service Call' : 'Enter VIN'}
          placeholderTextColor="gray"
          maxLength={sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall' ? 6 : 17}
          keyboardType="numeric"
        />
        <Text style={styles.vinLabel}>
          {sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall' ? 'Enter Serial Number (optional):' : 'Enter REG (optional):'}
        </Text>
        <TextInput
          style={styles.vinInput}
          value={reg}
          onChangeText={setReg}
          placeholder={sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall' ? 'Enter Serial Number' : 'Enter REG'}
          placeholderTextColor="gray"
          maxLength={sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall' ? 4 : 7}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.bottomButton, { borderColor: sendEmailButtonColor, borderWidth: sendEmailButtonColor === 'green' ? 10 : 3 }]} // Set border width conditionally
          onPress={handleSave}
        >
          <Text style={styles.bottomButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VinRegEntry;