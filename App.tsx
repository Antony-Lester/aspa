import React, { useEffect, createContext, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import HomeScreen from './pages/Home';
import ObliInstall from './pages/ObliInstall';
import ObliRepair from './pages/ObliRepair';
import WeighbridgeInstall from './pages/WeighbridgeInstall';
import WeighbridgeRepair from './pages/WeighbridgeRepair';
import SettingsScreen from './pages/SettingsScreen';
import VinRegEntry from './pages/VinRegEntry';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import { ThemeProvider, useTheme } from './ThemeContext';
import { EmailProvider } from './EmailContext';
import { ImagesProvider } from './ImagesContext';
import useStyles from './styles';

const Stack = createStackNavigator();

const StatusBarContext = createContext({
  setStatusBarColor: (color: string) => {},
  setNavigationBarColor: (color: string) => {},
});

const App = () => {
  const { colors } = useTheme();
  const styles = useStyles();
  const [statusBarColor, setStatusBarColor] = useState(colors.secondary);
  const [navigationBarColor, setNavigationBarColor] = useState(colors.secondary);
  const [initialRouteName, setInitialRouteName] = useState('Home');

  useEffect(() => {
    // Apply status bar color
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(statusBarColor === colors.primary ? 'light-content' : 'dark-content');
  }, [statusBarColor, colors]);

  useEffect(() => {
    // Apply navigation bar color
    changeNavigationBarColor(navigationBarColor, true);
  }, [navigationBarColor]);

  return (
    <ThemeProvider>
      <EmailProvider>
        <ImagesProvider>
          <StatusBarContext.Provider value={{ setStatusBarColor, setNavigationBarColor }}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen
                  name="ObliInstall"
                  component={ObliInstall}
                  options={{
                    title: 'OBLI Install',
                    headerStyle: {
                      backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.onPrimary,
                  }}
                />
                <Stack.Screen name="ObliRepair" component={ObliRepair} options={{ title: 'Obli Repair' }} />
                <Stack.Screen name="WeighbridgeInstall" component={WeighbridgeInstall} options={{ title: 'Weighbridge Install' }} />
                <Stack.Screen name="WeighbridgeRepair" component={WeighbridgeRepair} options={{ title: 'Weighbridge Repair' }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
                <Stack.Screen name="VinRegEntry" component={VinRegEntry} options={{ title: 'Enter VIN and REG' }} />
                <Stack.Screen name="ConfirmEmailPage" component={ConfirmEmailPage} options={{ title: 'Confirm Email' }} />
              </Stack.Navigator>
            </NavigationContainer>
          </StatusBarContext.Provider>
        </ImagesProvider>
      </EmailProvider>
    </ThemeProvider>
  );
};

export default App;
export { StatusBarContext };