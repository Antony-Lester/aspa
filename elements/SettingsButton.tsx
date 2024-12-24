import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import useStyles from '../styles'; // Import useStyles

const SettingsButton = () => {
  const navigation = useNavigation<any>();
  const styles = useStyles();
  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  // Conditionally render the button based on the current route
  if (currentRoute === 'Settings') {
    return null; // Do not display the button on the Settings screen
  }

  return (
    <TouchableOpacity
      style={styles.settingsButton}
      onPress={() => {
        navigation.navigate('Settings');
      }}
    >
      <Text style={styles.settingsButtonText}>⚙️</Text>
    </TouchableOpacity>
  );
};

export default SettingsButton;