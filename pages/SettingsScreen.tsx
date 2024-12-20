import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import useStyles from '../styles'; // Import useStyles
import { useTheme } from '../ThemeContext'; // Import useTheme

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
      route.params.setObliInstallEmail(obliInstallEmail); // Ensure the obli install email is set correctly
      route.params.setObliRepairEmail(obliRepairEmail); // Ensure the obli repair email is set correctly
      route.params.setWeighbridgeRepairEmail(weighbridgeRepairEmail); // Ensure the weighbridge repair email is set correctly
      route.params.setWeighbridgeInstallEmail(weighbridgeInstallEmail); // Ensure the weighbridge install email is set correctly
      navigation.goBack();
    } else {
      Alert.alert('Invalid Email', 'Please enter valid email addresses.');
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setTheme(theme); // Apply the selected theme colors to the app
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default SettingsScreen;