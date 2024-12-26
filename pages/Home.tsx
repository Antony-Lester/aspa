import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
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
  const styles = useStyles(colors); // Use styles

  useFocusEffect(
    React.useCallback(() => {
      // Set the status bar color
      StatusBar.setBackgroundColor(colors.background);
      StatusBar.setBarStyle(colors.statusBarStyle as StatusBarStyle);

      // Set the navigation bar color
      changeNavigationBarColor(colors.background, true);
    }, [colors])
  );

  return (
    <View style={[styles.homeButtonContainer, { backgroundColor: colors.background }]}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('ObliInstall')}
      >
        <Text style={styles.homeButtonText}>Obli Install</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('ObliRepair')}
      >
        <Text style={styles.homeButtonText}>Obli Repair</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('WeighbridgeInstall')}
      >
        <Text style={styles.homeButtonText}>Weighbridge Install</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('WeighbridgeRepair')}
      >
        <Text style={styles.homeButtonText}>Weighbridge Repair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;