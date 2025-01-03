import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../App';

type SettingsScreenProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const styles = StyleSheet.create({
  button: { padding: 10, marginRight: 10 },
  buttonText: { fontSize: 28 }
});

const SettingsButton = () => {
  const navigation = useNavigation<SettingsScreenProp>();
  return (<TouchableOpacity style={styles.button}
    onPress={() => { navigation.navigate('Settings'); }}>
    <Text style={styles.buttonText}>⚙️</Text>
  </TouchableOpacity>
  );
};

export default SettingsButton;