import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

interface SettingsScreenProps {
  navigation: any;
  route: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
  const [email, setEmail] = useState(route.params.email);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSave = () => {
    if (validateEmail(email)) {
      route.params.setEmail(email);
      navigation.goBack();
    } else {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
    }
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
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default SettingsScreen;