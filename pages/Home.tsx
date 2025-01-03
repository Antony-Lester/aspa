import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, StatusBarStyle } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import { RootStackParamList } from '../App';
import { useTheme } from '../ThemeContext';
import useStyles from '../styles';
import SettingsButton from '../elements/SettingsButton';
import WeighPadsButton from '../elements/WeighPadsButton';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = useStyles();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.onPrimary, headerRight: () => <SettingsButton />
    });
  }, [navigation, colors]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor(colors.primary);
      StatusBar.setBarStyle(colors.statusBarStyle as StatusBarStyle);
      changeNavigationBarColor(colors.primary, true);
    }, [colors])
  );

  return (
    <View style={styles.homeButtonContainer}>
      <View style={styles.headerButtons}> <SettingsButton /> <WeighPadsButton /> </View>
      <Image source={require('../assets/Logo.png')} style={styles.logo} resizeMode="contain" />

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ObliInstall')}>
        <Text style={styles.homeButtonText}>Obli Install</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ObliRepair')}>
        <Text style={styles.homeButtonText}>Obli Repair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('WeighbridgeInstall')}>
        <Text style={styles.homeButtonText}>Weighbridge Install</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('WeighbridgeRepair')}>
        <Text style={styles.homeButtonText}>Weighbridge Repair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;