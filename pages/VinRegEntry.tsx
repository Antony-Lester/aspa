// VinRegEntry.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import useStyles from '../styles'; // Import useStyles
import { handleOpenMailApp } from '../utils/emailUtils'; // Import handleOpenMailApp
import { useEmail } from '../EmailContext'; // Import useEmail

import { NavigationProp, RouteProp } from '@react-navigation/native';

type VinRegEntryProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { images: string[][]; sourcePage: string } }, 'params'>;
};

const VinRegEntry = ({ navigation, route }: VinRegEntryProps) => {
  const { images, sourcePage } = route.params || {};
  const styles = useStyles();
  const { obliInstallEmail, obliRepairEmail, weighbridgeRepairEmail, weighbridgeInstallEmail } = useEmail(); // Use email context
  const [vin, setVin] = useState('');
  const [reg, setReg] = useState('');
  const [emailOpened, setEmailOpened] = useState(false);
  const [chassisPlateUri, setChassisPlateUri] = useState('');
  const [sendEmailButtonColor, setSendEmailButtonColor] = useState('red');
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    // Suggest VIN and REG based on images
    const suggestVinAndReg = async () => {
      // Identify the Chassis plate image based on the tag
      for (const imageArray of images) {
        for (const imageUri of imageArray) {
          if (imageUri.includes('Chassis_Plate.jpg')) {
            setChassisPlateUri(imageUri);
            break;
          }
        }
      }
    };

    suggestVinAndReg();
  }, [images]);

  useEffect(() => {
    // Validate VIN and set button color
    const isValidVin = vin.replace(/\s/g, '').length >= 6 && vin.replace(/\s/g, '').length <= 17;
    setSendEmailButtonColor(isValidVin ? 'green' : 'red');
  }, [vin]);

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

  useFocusEffect(
    React.useCallback(() => {
      if (emailOpened) {
        Alert.alert(
          'Email Sent?',
          'Have You Sent the Email?',
          [
            {
              text: 'Yes',
              onPress: async () => {
                // Delete all images
                for (const imageArray of images) {
                  for (const imageUri of imageArray) {
                    try {
                      await RNFS.unlink(imageUri);
                      console.log(`Deleted image: ${imageUri}`);
                    } catch (error) {
                      console.error(`Failed to delete image: ${imageUri}`, error);
                    }
                  }
                }
                // Reset VIN and REG values
                setVin('');
                setReg('');
                // Navigate to Home screen
                navigation.navigate('HomePage');
              },
            },
            {
              text: 'No',
              onPress: () => {
                // Re-open the email app
                const subject = `${new Date().toISOString().split('T')[0]} ${vin} ${reg || ''}`;
                const body = 'Attached are the installation images.';
                const attachments = images.flat();
                handleOpenMailApp(vin, reg, getEmailAddress(), ['Chassis Plate', 'Reg Plate'], images, () => 'green', navigation, sourcePage);
              },
            },
          ],
          { cancelable: false }
        );
      }
    }, [emailOpened, images, navigation])
  );

  const handleSave = () => {
    const formattedVin = vin.replace(/\s/g, ''); // Remove spaces from VIN
    if (formattedVin.length < 6 || formattedVin.length > 17) {
      Alert.alert('Invalid VIN', 'Please enter a valid VIN number.');
      return;
    }
    // Handle save logic with formattedVin
    console.log('Formatted VIN:', formattedVin);
    handleOpenMailApp(formattedVin, reg, getEmailAddress(), ['Chassis Plate', 'Reg Plate'], images, () => 'green', navigation, sourcePage);
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
        <Text style={styles.vinLabel}>Enter VIN:</Text>
        <TextInput
          style={styles.vinInput}
          value={vin}
          onChangeText={setVin}
          placeholder="Enter VIN"
          placeholderTextColor="gray"
          maxLength={17}
        />
        <Text style={styles.vinLabel}>Enter REG (optional):</Text>
        <TextInput
          style={styles.vinInput}
          value={reg}
          onChangeText={setReg}
          placeholder="Enter REG"
          placeholderTextColor="gray"
          maxLength={7}
        />
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.bottomButton, { borderColor: sendEmailButtonColor, borderWidth: 11 }]}
          onPress={handleSave}
        >
          <Text style={styles.bottomButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VinRegEntry;