import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import useStyles from '../styles';
import { useTheme } from '../ThemeContext';
import { useEmail } from '../EmailContext';

const SettingsScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { obliInstallEmail, setObliInstallEmail, obliRepairEmail, setObliRepairEmail, weighbridgeRepairEmail, setWeighbridgeRepairEmail, weighbridgeInstallEmail, setWeighbridgeInstallEmail } = useEmail();
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [imageQuality, setImageQuality] = useState('0.5');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedObliInstallEmail = await AsyncStorage.getItem('obliInstallEmail');
        const storedObliRepairEmail = await AsyncStorage.getItem('obliRepairEmail');
        const storedWeighbridgeRepairEmail = await AsyncStorage.getItem('weighbridgeRepairEmail');
        const storedWeighbridgeInstallEmail = await AsyncStorage.getItem('weighbridgeInstallEmail');
        const storedTheme = await AsyncStorage.getItem('selectedTheme');
        const storedImageQuality = await AsyncStorage.getItem('imageQuality');

        if (storedObliInstallEmail) {
          setObliInstallEmail(storedObliInstallEmail);
          console.log('Loaded OBLI Install Email:', storedObliInstallEmail);
        }
        if (storedObliRepairEmail) {
          setObliRepairEmail(storedObliRepairEmail);
          console.log('Loaded OBLI Repair Email:', storedObliRepairEmail);
        }
        if (storedWeighbridgeRepairEmail) {
          setWeighbridgeRepairEmail(storedWeighbridgeRepairEmail);
          console.log('Loaded Weighbridge Repair Email:', storedWeighbridgeRepairEmail);
        }
        if (storedWeighbridgeInstallEmail) {
          setWeighbridgeInstallEmail(storedWeighbridgeInstallEmail);
          console.log('Loaded Weighbridge Install Email:', storedWeighbridgeInstallEmail);
        }
        if (storedTheme) setSelectedTheme(storedTheme);
        if (storedImageQuality) setImageQuality(storedImageQuality);
      } catch (error) {
        console.error('Failed to load settings.', error);
      }
    };

    loadSettings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        const saveSettings = async () => {
          try {
            await AsyncStorage.setItem('obliInstallEmail', obliInstallEmail);
            console.log('Saved OBLI Install Email:', obliInstallEmail);
            await AsyncStorage.setItem('obliRepairEmail', obliRepairEmail);
            console.log('Saved OBLI Repair Email:', obliRepairEmail);
            await AsyncStorage.setItem('weighbridgeRepairEmail', weighbridgeRepairEmail);
            console.log('Saved Weighbridge Repair Email:', weighbridgeRepairEmail);
            await AsyncStorage.setItem('weighbridgeInstallEmail', weighbridgeInstallEmail);
            console.log('Saved Weighbridge Install Email:', weighbridgeInstallEmail);
          } catch (error) {
            console.error('Failed to save settings.', error);
          }
        };

        saveSettings();
      };
    }, [obliInstallEmail, obliRepairEmail, weighbridgeRepairEmail, weighbridgeInstallEmail])
  );

  const handleEmailChange = (key, value) => {
    switch (key) {
      case 'obliInstallEmail':
        setObliInstallEmail(value);
        break;
      case 'obliRepairEmail':
        setObliRepairEmail(value);
        break;
      case 'weighbridgeRepairEmail':
        setWeighbridgeRepairEmail(value);
        break;
      case 'weighbridgeInstallEmail':
        setWeighbridgeInstallEmail(value);
        break;
      default:
        break;
    }
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    AsyncStorage.setItem('selectedTheme', theme);
  };

  const handleImageQualityChange = (quality) => {
    setImageQuality(quality);
    AsyncStorage.setItem('imageQuality', quality);
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>OBLI Install Email:</Text>
        <TextInput
          style={styles.input}
          value={obliInstallEmail}
          onChangeText={(text) => handleEmailChange('obliInstallEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={obliInstallEmail || "Enter OBLI Install Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>OBLI Repair Email:</Text>
        <TextInput
          style={styles.input}
          value={obliRepairEmail}
          onChangeText={(text) => handleEmailChange('obliRepairEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={obliRepairEmail || "Enter OBLI Repair Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Weighbridge Repair Email:</Text>
        <TextInput
          style={styles.input}
          value={weighbridgeRepairEmail}
          onChangeText={(text) => handleEmailChange('weighbridgeRepairEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={weighbridgeRepairEmail || "Enter Weighbridge Repair Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Weighbridge Install Email:</Text>
        <TextInput
          style={styles.input}
          value={weighbridgeInstallEmail}
          onChangeText={(text) => handleEmailChange('weighbridgeInstallEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={weighbridgeInstallEmail || "Enter Weighbridge Install Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Select Theme:</Text>
        <Picker
          selectedValue={selectedTheme}
          style={styles.picker}
          onValueChange={(itemValue) => handleThemeChange(itemValue)}
        >
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Dark" value="dark" />
          <Picker.Item label="High Contrast" value="highContrast" />
        </Picker>
        <Text style={styles.label}>Image Quality:</Text>
        <Picker
          selectedValue={imageQuality}
          style={styles.picker}
          onValueChange={(itemValue) => handleImageQualityChange(itemValue)}
        >
          <Picker.Item label="0.1" value="0.1" />
          <Picker.Item label="0.2" value="0.2" />
          <Picker.Item label="0.3" value="0.3" />
          <Picker.Item label="0.4" value="0.4" />
          <Picker.Item label="0.5" value="0.5" />
          <Picker.Item label="0.6" value="0.6" />
          <Picker.Item label="0.7" value="0.7" />
          <Picker.Item label="0.8" value="0.8" />
        </Picker>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;