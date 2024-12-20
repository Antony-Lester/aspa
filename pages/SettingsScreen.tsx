import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import useStyles from '../styles'; // Import useStyles
import { useTheme } from '../ThemeContext'; // Import useTheme
import { openMailApp } from '../utils/emailUtils'; // Import openMailApp

interface SettingsScreenProps {
  navigation: any;
  route: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
  const { setTheme } = useTheme(); // Use setTheme from ThemeContext
  const styles = useStyles(); // Use styles
  const [obliInstallEmail, setObliInstallEmail] = useState(route.params.obliInstallEmail);
  const [obliRepairEmail, setObliRepairEmail] = useState(route.params.obliRepairEmail);
  const [weighbridgeRepairEmail, setWeighbridgeRepairEmail] = useState(route.params.weighbridgeRepairEmail);
  const [weighbridgeInstallEmail, setWeighbridgeInstallEmail] = useState(route.params.weighbridgeInstallEmail);
  const [selectedTheme, setSelectedTheme] = useState('light');

  useEffect(() => {
    navigation.setOptions({
      setObliInstallEmail: (email: string) => {
        setObliInstallEmail(email);
      },
      setObliRepairEmail: (email: string) => {
        setObliRepairEmail(email);
      },
      setWeighbridgeRepairEmail: (email: string) => {
        setWeighbridgeRepairEmail(email);
      },
      setWeighbridgeInstallEmail: (email: string) => {
        setWeighbridgeInstallEmail(email);
      },
    });
  }, [navigation]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSave = () => {
    if (validateEmail(obliInstallEmail) && validateEmail(obliRepairEmail) && validateEmail(weighbridgeRepairEmail) && validateEmail(weighbridgeInstallEmail)) {
      navigation.setOptions({
        setObliInstallEmail: obliInstallEmail,
        setObliRepairEmail: obliRepairEmail,
        setWeighbridgeRepairEmail: weighbridgeRepairEmail,
        setWeighbridgeInstallEmail: weighbridgeInstallEmail,
      });
      navigation.goBack();
    } else {
      Alert.alert('Invalid Email', 'Please enter valid email addresses.');
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setTheme(theme); // Apply the selected theme colors to the app
  };

  const handleTestEmail = () => {
    const email = obliInstallEmail; // Use the set email address
    const subject = 'Test Email'; // Test subject
    const body = 'This is a test email with a sample image attachment.'; // Test body
    const attachments = ['file:///storage/emulated/0/rn_image_picker_lib_temp_405e67d2-ea2f-4194-a470-f651b02a4c59.jpg']; // Sample attachment

    openMailApp(email, subject, body, attachments);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Obli Install Email Address:</Text>
      <TextInput
        style={styles.input}
        value={obliInstallEmail}
        onChangeText={setObliInstallEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter Obli Install Email Address"
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>Obli Repair Email Address:</Text>
      <TextInput
        style={styles.input}
        value={obliRepairEmail}
        onChangeText={setObliRepairEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter Obli Repair Email Address"
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>Weighbridge Repair Email Address:</Text>
      <TextInput
        style={styles.input}
        value={weighbridgeRepairEmail}
        onChangeText={setWeighbridgeRepairEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter Weighbridge Repair Email Address"
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>Weighbridge Install Email Address:</Text>
      <TextInput
        style={styles.input}
        value={weighbridgeInstallEmail}
        onChangeText={setWeighbridgeInstallEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter Weighbridge Install Email Address"
        placeholderTextColor="gray"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
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
      <Button title="Test Email" onPress={handleTestEmail} />
    </ScrollView>
  );
};

export default SettingsScreen;