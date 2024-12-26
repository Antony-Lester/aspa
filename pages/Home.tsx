import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../ThemeContext'; // Import useTheme
import useStyles from '../styles'; // Import useStyles
import changeNavigationBarColor from 'react-native-navigation-bar-color'; // Import navigation bar color changer

type RootStackParamList = {
  'Obli Repair': undefined;
  'Obli Install': undefined;
  'Weighbridge Install': undefined;
  'Weighbridge Repair': undefined;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(); // Use styles

  useEffect(() => {
    // Set the status bar color
    StatusBar.setBackgroundColor(colors.secondary);
    StatusBar.setBarStyle('light-content');

    // Set the navigation bar color
    changeNavigationBarColor(colors.secondary, true);
  }, [colors]);

  return (
    <View style={styles.homeButtonContainer}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('ObliInstall')}
      >
        <Text style={styles.bottomButtonText}>Obli Install</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('ObliRepair')}
      >
        <Text style={styles.bottomButtonText}>Obli Repair</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('WeighbridgeInstall')}
      >
        <Text style={styles.bottomButtonText}>Weighbridge Install</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('WeighbridgeRepair')}
      >
        <Text style={styles.bottomButtonText}>Weighbridge Repair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;