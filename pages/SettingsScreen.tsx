import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, BackHandler } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../ThemeContext'; // Import useTheme
import useStyles from '../styles'; // Use styles
import { useEmail } from '../EmailContext'; // Import useEmail

const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const { colors, setTheme } = useTheme(); // Use theme colors and setTheme function
  const styles = useStyles(); // Use styles
  const {
    obliInstallEmail,
    setObliInstallEmail,
    obliRepairEmail,
    setObliRepairEmail,
    weighbridgeRepairEmail,
    setWeighbridgeRepairEmail,
    weighbridgeInstallEmail,
    setWeighbridgeInstallEmail,
  } = useEmail(); // Use email context

  const [selectedTheme, setSelectedTheme] = useState('default'); // Add state for selectedTheme
  const [imageQuality, setImageQuality] = useState('0.5'); // Add state for imageQuality

  useEffect(() => {
    console.log('SettingsScreen mounted');
    console.log('Initial obliInstallEmail:', obliInstallEmail);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!validateEmail(obliInstallEmail)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return true; // Prevent default behavior (navigation)
      }
      return false; // Allow default behavior (navigation)
    });

    return () => {
      console.log('SettingsScreen unmounted');
      backHandler.remove();
    };
  }, [navigation, obliInstallEmail]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailBlur = (email: string, setEmail: (email: string) => void) => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
    } else {
      setEmail(email);
      console.log('Email validated and set:', email);
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setTheme(theme); // Apply the selected theme colors to the app
    console.log('Theme changed to:', theme);
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Obli Install Email:</Text>
        <TextInput
          style={styles.input}
          value={obliInstallEmail}
          onChangeText={setObliInstallEmail}
          onBlur={() => handleEmailBlur(obliInstallEmail, setObliInstallEmail)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={obliInstallEmail || "Enter Obli Install Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Obli Repair Email:</Text>
        <TextInput
          style={styles.input}
          value={obliRepairEmail}
          onChangeText={setObliRepairEmail}
          onBlur={() => handleEmailBlur(obliRepairEmail, setObliRepairEmail)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={obliRepairEmail || "Enter Obli Repair Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Weighbridge Repair Email:</Text>
        <TextInput
          style={styles.input}
          value={weighbridgeRepairEmail}
          onChangeText={setWeighbridgeRepairEmail}
          onBlur={() => handleEmailBlur(weighbridgeRepairEmail, setWeighbridgeRepairEmail)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={weighbridgeRepairEmail || "Enter Weighbridge Repair Email"}
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Weighbridge Install Email:</Text>
        <TextInput
          style={styles.input}
          value={weighbridgeInstallEmail}
          onChangeText={setWeighbridgeInstallEmail}
          onBlur={() => handleEmailBlur(weighbridgeInstallEmail, setWeighbridgeInstallEmail)}
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
          <Picker.Item label="Default" value="default" />
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Dark" value="dark" />
          <Picker.Item label="High Contrast" value="highContrast" />
        </Picker>
        <Text style={styles.label}>Image Quality:</Text>
        <Picker
          selectedValue={imageQuality}
          style={styles.picker}
          onValueChange={(itemValue) => setImageQuality(itemValue)}
        >
          <Picker.Item label="0.1" value="0.1" />
          <Picker.Item label="0.2" value="0.2" />
          <Picker.Item label="0.3" value="0.3" />
          <Picker.Item label="0.4" value="0.4" />
          <Picker.Item label="0.5" value="0.5" />
          <Picker.Item label="0.6" value="0.6" />
          <Picker.Item label="0.7" value="0.7" />
          <Picker.Item label="0.8" value="0.8" />
          <Picker.Item label="0.9" value="0.9" />
          <Picker.Item label="1.0" value="1.0" />
        </Picker>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;