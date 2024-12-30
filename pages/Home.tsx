import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, StatusBarStyle } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../ThemeContext'; // Import useTheme
import useStyles from '../styles'; // Import useStyles
import changeNavigationBarColor from 'react-native-navigation-bar-color'; // Import navigation bar color changer
import SettingsButton from '../elements/SettingsButton'; // Import SettingsButton

type RootStackParamList = {
  'Obli Repair': undefined;
  'Obli Install': undefined;
  'Weighbridge Install': undefined;
  'Weighbridge Repair': undefined;
  'Settings': undefined;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(); // Use styles

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.primary, // Set the top navigation bar color
      },
      headerTintColor: colors.onPrimary, // Set the text color on the navigation bar to a lighter color
      headerRight: () => <SettingsButton />, // Use SettingsButton here
    });
  }, [navigation, colors]);

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