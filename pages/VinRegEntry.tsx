// VinRegEntry.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
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
import { openMailApp } from '../utils/emailUtils'; // Import openMailApp

const VinRegEntry = ({ navigation, route }) => {
  const { images, emailAddress } = route.params || {};
  const styles = useStyles();
  const [vin, setVin] = useState('');
  const [reg, setReg] = useState('');
  const [emailOpened, setEmailOpened] = useState(false);
  const [chassisPlateUri, setChassisPlateUri] = useState('');

  useEffect(() => {
    // Suggest VIN and REG based on images
    const suggestVinAndReg = async () => {
      // Logic to suggest VIN and REG
      // Assuming the Chassis plate image is the first image in the first array
      if (images.length > 0 && images[0].length > 0) {
        setChassisPlateUri(images[0][0]);
      }
    };

    suggestVinAndReg();
  }, [images]);

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
                openMailApp(emailAddress, subject, body, attachments);
              },
            },
          ],
          { cancelable: false }
        );
      }
    }, [emailOpened, images, vin, reg, emailAddress, navigation])
  );

  const validateVin = (vin: string) => {
    const isValid = vin.length >= 6 && vin.length <= 17;
    console.log('Validating VIN:', vin, 'isValid:', isValid);
    return isValid;
  };

  const validateReg = (reg: string) => {
    const isValid = reg.length <= 7;
    console.log('Validating REG:', reg, 'isValid:', isValid);
    return isValid;
  };

  const handleSave = () => {
    console.log('Handle Save clicked');
    if (!validateVin(vin)) {
      Alert.alert('Invalid VIN', 'VIN should be between 6 and 17 characters long.');
      return;
    }
    if (!validateReg(reg)) {
      Alert.alert('Invalid REG', 'REG should be a maximum of 7 characters long.');
      return;
    }
    console.log('Sending email with VIN:', vin, 'and REG:', reg);

    const subject = `${new Date().toISOString().split('T')[0]} ${vin} ${reg || ''}`;
    const body = 'Attached are the installation images.';
    const attachments = images.flat();

    openMailApp(emailAddress, subject, body, attachments);
    setEmailOpened(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {chassisPlateUri ? (
          <Image
            source={{ uri: `file://${chassisPlateUri}` }}
            style={styles.chassisPlateImage}
            resizeMode="contain"
          />
        ) : null}
        <Text style={styles.label}>Enter VIN:</Text>
        <TextInput
          style={styles.input}
          value={vin}
          onChangeText={setVin}
          placeholder="Enter VIN"
          placeholderTextColor="gray"
          maxLength={17}
        />
        <Text style={styles.label}>Enter REG (optional):</Text>
        <TextInput
          style={styles.input}
          value={reg}
          onChangeText={setReg}
          placeholder="Enter REG"
          placeholderTextColor="gray"
          maxLength={7}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VinRegEntry;