import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import useStyles from './styles'; // Import useStyles
import { useTheme } from './ThemeContext'; // Import useTheme

interface SettingsScreenProps {
  navigation: any;
  route: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
  const { setTheme } = useTheme(); // Use setTheme from ThemeContext
  const styles = useStyles(); // Use styles
  const [email, setEmail] = useState(route.params.email);
  const [selectedTheme, setSelectedTheme] = useState('default');

  useEffect(() => {
    navigation.setOptions({
      setEmail: (email: string) => {
        setEmail(email);
      },
    });
  }, [navigation]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSave = () => {
    if (validateEmail(email)) {
      navigation.getParam('setEmail')(email);
      navigation.goBack();
    } else {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setTheme(theme); // Apply the selected theme colors to the app
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email Address:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter The email Address"
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