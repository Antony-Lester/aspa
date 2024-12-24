import React, { useEffect, createContext, useContext, useState } from 'react';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './pages/HomePage'; // Import HomePage
import ObliInstall from './pages/ObliInstall'; // Import ObliInstall
import ObliRepair from './pages/ObliRepair'; // Import ObliRepair
import WeighbridgeInstall from './pages/WeighbridgeInstall'; // Import WeighbridgeInstall
import WeighbridgeRepair from './pages/WeighbridgeRepair'; // Import WeighbridgeRepair
import SettingsScreen from './pages/SettingsScreen'; // Import SettingsScreen
import VinRegEntry from './pages/VinRegEntry'; // Import VinRegEntry
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider and useTheme
import { EmailProvider } from './EmailContext'; // Import EmailProvider
import { StatusBar } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color'; // Import navigation bar color changer
import SettingsButton from './elements/SettingsButton'; // Import SettingsButton
import useStyles from './styles'; // Import useStyles

const Stack = createStackNavigator();

const StatusBarContext = createContext({
  setStatusBarColor: (color: string) => {},
  setNavigationBarColor: (color: string) => {},
});

const App = () => {
  const { colors } = useTheme(); // Use theme colors
  const styles = useStyles(); // Use styles
  const [statusBarColor, setStatusBarColor] = useState(colors.secondary);
  const [navigationBarColor, setNavigationBarColor] = useState(colors.secondary);

  return (
    <ThemeProvider>
      <EmailProvider>
        <StatusBarContext.Provider value={{ setStatusBarColor, setNavigationBarColor }}>
          <NavigationContainer>
            <MainNavigator statusBarColor={statusBarColor} navigationBarColor={navigationBarColor} />
          </NavigationContainer>
        </StatusBarContext.Provider>
      </EmailProvider>
    </ThemeProvider>
  );
};

const MainNavigator = ({ statusBarColor, navigationBarColor }: { statusBarColor: string, navigationBarColor: string }) => {
  const { colors } = useTheme(); // Use theme colors
  const state = useNavigationState(state => state);
  const { setStatusBarColor, setNavigationBarColor } = useContext(StatusBarContext);

  useEffect(() => {
    if (state && state.routes) {
      const currentRoute = state.routes[state.index].name;
      if (currentRoute === 'HomePage') {
        setStatusBarColor(colors.secondary);
        setNavigationBarColor(colors.secondary);
      } else {
        setStatusBarColor(colors.primary);
        setNavigationBarColor(colors.primary);
      }
    }
  }, [state, colors, setStatusBarColor, setNavigationBarColor]);

  useEffect(() => {
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(statusBarColor === colors.secondary ? 'light-content' : 'dark-content');
    changeNavigationBarColor(navigationBarColor, statusBarColor === colors.secondary);
  }, [statusBarColor, navigationBarColor, colors]);

  return (
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
        headerRight: () => <SettingsButton />, // Add the custom button to the header
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
        options={{ title: 'Obli Install' }} // Ensure the screen name matches exactly
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
      <Stack.Screen
        name="VinRegEntry"
        component={VinRegEntry}
        options={{ title: 'Enter VIN and REG' }}
      />
    </Stack.Navigator>
  );
};

export default App;
export { StatusBarContext };