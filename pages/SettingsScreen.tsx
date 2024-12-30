import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useStyles from '../styles';
import { useTheme } from '../ThemeContext';
import { useEmail } from '../EmailContext';
import { setItem, getItem } from '../storage';

const SettingsScreen = () => {
  const { colors, setTheme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  const { obliInstallEmail, setObliInstallEmail, obliRepairEmail, setObliRepairEmail, weighbridgeRepairEmail, setWeighbridgeRepairEmail, weighbridgeInstallEmail, setWeighbridgeInstallEmail } = useEmail();
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [imageQuality, setImageQuality] = useState('0.5');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: colors.onPrimary,
    });
  }, [navigation, colors]);

  useEffect(() => {
    const loadSettings = () => {
      const storedObliInstallEmail = getItem('obliInstallEmail');
      const storedObliRepairEmail = getItem('obliRepairEmail');
      const storedWeighbridgeRepairEmail = getItem('weighbridgeRepairEmail');
      const storedWeighbridgeInstallEmail = getItem('weighbridgeInstallEmail');
      const storedTheme = getItem('selectedTheme');
      const storedImageQuality = getItem('imageQuality');

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
      if (storedTheme) {
        setSelectedTheme(storedTheme);
        setTheme(storedTheme);
      }
      if (storedImageQuality) setImageQuality(storedImageQuality);
    };

    loadSettings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        const saveSettings = () => {
          try {
            setItem('obliInstallEmail', obliInstallEmail);
            console.log('Saved OBLI Install Email:', obliInstallEmail);
            setItem('obliRepairEmail', obliRepairEmail);
            console.log('Saved OBLI Repair Email:', obliRepairEmail);
            setItem('weighbridgeRepairEmail', weighbridgeRepairEmail);
            console.log('Saved Weighbridge Repair Email:', weighbridgeRepairEmail);
            setItem('weighbridgeInstallEmail', weighbridgeInstallEmail);
            console.log('Saved Weighbridge Install Email:', weighbridgeInstallEmail);
            setItem('selectedTheme', selectedTheme);
            setItem('imageQuality', imageQuality);
          } catch (error) {
            console.error('Failed to save settings.', error);
          }
        };

        saveSettings();
      };
    }, [obliInstallEmail, obliRepairEmail, weighbridgeRepairEmail, weighbridgeInstallEmail, selectedTheme, imageQuality])
  );

  const handleEmailChange = (key: string, value: string) => {
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

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setTheme(theme);
    setItem('selectedTheme', theme);
  };

  const handleImageQualityChange = (quality: string) => {
    setImageQuality(quality);
    setItem('imageQuality', quality);
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.settingsLabel}>OBLI Install Email:</Text>
        <TextInput
          style={styles.settingsInput}
          value={obliInstallEmail}
          onChangeText={(text) => handleEmailChange('obliInstallEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={obliInstallEmail || "Enter OBLI Install Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.settingsLabel}>OBLI Repair Email:</Text>
        <TextInput
          style={styles.settingsInput}
          value={obliRepairEmail}
          onChangeText={(text) => handleEmailChange('obliRepairEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={obliRepairEmail || "Enter OBLI Repair Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.settingsLabel}>Weighbridge Repair Email:</Text>
        <TextInput
          style={styles.settingsInput}
          value={weighbridgeRepairEmail}
          onChangeText={(text) => handleEmailChange('weighbridgeRepairEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={weighbridgeRepairEmail || "Enter Weighbridge Repair Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.settingsLabel}>Weighbridge Install Email:</Text>
        <TextInput
          style={styles.settingsInput}
          value={weighbridgeInstallEmail}
          onChangeText={(text) => handleEmailChange('weighbridgeInstallEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={weighbridgeInstallEmail || "Enter Weighbridge Install Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.settingsLabel}>Select Theme:</Text>
        <View style={styles.settingsInput}>
          <Picker
            selectedValue={selectedTheme}
            onValueChange={(itemValue) => handleThemeChange(itemValue)}
            style={{ color: colors.onSurface }}
          >
            <Picker.Item label="Light" value="light" />
            <Picker.Item label="Dark" value="dark" />
            <Picker.Item label="High Contrast" value="highContrast" />
          </Picker>
        </View>
        <Text style={styles.settingsLabel}>Image Quality:</Text>
        <View style={styles.settingsInput}>
          <Picker
            selectedValue={imageQuality}
            onValueChange={(itemValue) => handleImageQualityChange(itemValue)}
            style={{ color: colors.onSurface }}
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
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;