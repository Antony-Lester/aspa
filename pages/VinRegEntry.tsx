// VinRegEntry.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import TextRecognition from 'react-native-text-recognition';
import useStyles from '../styles'; // Use styles
import { openMailApp } from '../utils/emailUtils'; // Import openMailApp
import RNFS from 'react-native-fs';

const VinRegEntry = () => {
  const styles = useStyles();
  const navigation = useNavigation();
  const route = useRoute();
  const { images, emailAddress } = route.params || {};

  const [vin, setVin] = useState('');
  const [reg, setReg] = useState('');
  const [emailOpened, setEmailOpened] = useState(false);

  useEffect(() => {
    console.log('VinRegEntry mounted');
    console.log('Images:', images);

    const extractTextFromImage = async (imageUri: string) => {
      console.log('Extracting text from image:', imageUri);
      try {
        const result = await TextRecognition.recognize(imageUri);
        console.log('Text recognition result:', result);
        const recognizedText = result.join('\n');
        console.log('Recognized text:', recognizedText);
        return recognizedText;
      } catch (error) {
        console.error('Failed to recognize text from image:', error);
        return '';
      }
    };

    const suggestVinAndReg = async () => {
      if (images[7].length > 0) { // Chassis Plate
        const vinText = await extractTextFromImage(images[7][0]);
        if (vinText) {
          console.log('Suggested VIN:', vinText);
          setVin(vinText);
          Alert.alert('VIN Found', `Suggested VIN: ${vinText}`);
        }
      }
      if (images[8].length > 0) { // Reg Plate
        const regText = await extractTextFromImage(images[8][0]);
        if (regText) {
          console.log('Suggested REG:', regText);
          setReg(regText);
          Alert.alert('REG Found', `Suggested REG: ${regText}`);
        }
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
    <View style={styles.container}>
      <Text style={styles.label}>Enter VIN:</Text>
      <TextInput
        style={styles.input}
        value={vin}
        onChangeText={setVin}
        placeholder="Enter VIN"
        maxLength={17}
      />
      <Text style={styles.label}>Enter REG (optional):</Text>
      <TextInput
        style={styles.input}
        value={reg}
        onChangeText={setReg}
        placeholder="Enter REG"
        maxLength={7}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default VinRegEntry;