import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './pages/HomePage'; // Import HomePage
import ObliInstall from './pages/ObliInstall'; // Import ObliInstall
import ObliRepair from './pages/ObliRepair'; // Import ObliRepair
import WeighbridgeInstall from './pages/WeighbridgeInstall'; // Import WeighbridgeInstall
import WeighbridgeRepair from './pages/WeighbridgeRepair'; // Import WeighbridgeRepair
import SettingsScreen from './pages/SettingsScreen'; // Import SettingsScreen
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider and useTheme

const Stack = createStackNavigator();

const App = () => {
  const { colors } = useTheme(); // Use theme colors

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomePage"
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.primary, // Apply theme primary color to the header
            },
            headerTintColor: colors.onPrimary, // Apply theme onPrimary color to the header text
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{ headerShown: false }} // Hide the header for the HomePage screen
          />
          <Stack.Screen
            name="Obli Install"
            component={ObliInstall}
            options={{ title: 'Obli Install' }} // Add space between the words
          />
          <Stack.Screen
            name="Obli Repair"
            component={ObliRepair}
            options={{ title: 'Obli Repair' }}
          />
          <Stack.Screen
            name="Weighbridge Install"
            component={WeighbridgeInstall}
            options={{ title: 'Weighbridge Install' }}
          />
          <Stack.Screen
            name="Weighbridge Repair"
            component={WeighbridgeRepair}
            options={{ title: 'Weighbridge Repair' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;