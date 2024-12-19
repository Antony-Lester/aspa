import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  StatusBarStyle,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { launchCamera } from 'react-native-image-picker';
import { useColorScheme } from 'react-native';
import HomePage from './pages/HomePage'; // Import HomePage
import ObliInstall from './pages/ObliInstall'; // Import ObliInstall
import ObliRepair from './pages/ObliRepair'; // Import ObliRepair
import WeighbridgeInstall from './pages/WeighbridgeInstall'; // Import WeighbridgeInstall
import WeighbridgeRepair from './pages/WeighbridgeRepair'; // Import WeighbridgeRepair
import SettingsScreen from './pages/SettingsScreen'; // Import SettingsScreen
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider and useTheme
import useStyles from './styles'; // Import useStyles
import changeNavigationBarColor from 'react-native-navigation-bar-color'; // Import the library

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomePage">
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{ headerShown: false }} // Hide the header for the HomePage screen
          />
          <Stack.Screen name="ObliInstall" component={ObliInstall} />
          <Stack.Screen name="ObliRepair" component={ObliRepair} />
          <Stack.Screen name="WeighbridgeInstall" component={WeighbridgeInstall} />
          <Stack.Screen name="WeighbridgeRepair" component={WeighbridgeRepair} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;