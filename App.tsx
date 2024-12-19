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
import SettingsScreen from './pages/SettingsScreen'; // Updated import path
import ObliInstalls from './pages/ObliInstalls'; // Import ObliInstalls
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider and useTheme
import useStyles from './styles'; // Import useStyles
import changeNavigationBarColor from 'react-native-navigation-bar-color'; // Import the library

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ObliInstalls">
          <Stack.Screen
            name="ObliInstalls"
            component={ObliInstalls}
            options={{ headerShown: false }} // Hide the header for the ObliInstalls screen
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;