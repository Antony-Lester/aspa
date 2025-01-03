import React, { createContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import HomePage from './pages/Home';
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
import { getItem, setItem } from './storage';
import WeighPads from './pages/WeighPads';
import { requestAllPermissions } from './utils/permissionsUtils';
import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  ObliInstall: undefined;
  ObliRepair: undefined;
  WeighbridgeInstall: undefined;
  WeighbridgeRepair: undefined;
  Settings: undefined;
  VinRegEntry: undefined;
  ConfirmEmailPage: { vin: string; reg: string; emailAddress: string; images: string[][]; sourcePage: string };
  WeighPads: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const StatusBarContext = createContext({
  setStatusBarColor: (color: string) => { },
  setNavigationBarColor: (color: string) => { },
});

const App = () => {
  const { colors } = useTheme();
  const [statusBarColor, setStatusBarColor] = useState(colors.primary);
  const [navigationBarColor, setNavigationBarColor] = useState(colors.primary);
  const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamList>('Home');

  useEffect(() => {
    const loadSettings = async () => {
      const storedStatusBarColor = await getItem('statusBarColor');
      const storedNavigationBarColor = await getItem('navigationBarColor');
      if (storedStatusBarColor) setStatusBarColor(storedStatusBarColor);
      if (storedNavigationBarColor) setNavigationBarColor(storedNavigationBarColor);
    };
    loadSettings();
    setStatusBarColor(colors.secondary);
    setNavigationBarColor(colors.secondary);
    requestAllPermissions('Home');
  }, []);

  useEffect(() => {
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(statusBarColor === colors.primary ? 'light-content' : 'dark-content');
  }, [statusBarColor, colors]);

  useEffect(() => {
    changeNavigationBarColor(navigationBarColor, true);
  }, [navigationBarColor]);

  return (
    <ThemeProvider>
      <EmailProvider>
        <ImagesProvider>
          <StatusBarContext.Provider value={{ setStatusBarColor, setNavigationBarColor }}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
                <Stack.Screen
                  name="ObliInstall"
                  component={ObliInstall}
                  options={{
                    title: 'OBLI Install',
                    headerStyle: { backgroundColor: colors.primary },
                    headerTintColor: colors.onPrimary,
                  }}
                />
                <Stack.Screen name="ObliRepair" component={ObliRepair} options={{
                  title: 'Obli Repair',
                  headerStyle: { backgroundColor: colors.primary },
                  headerTintColor: colors.onPrimary,
                }} />
                <Stack.Screen name="WeighbridgeInstall" component={WeighbridgeInstall} options={{
                  title: 'Weighbridge Install',
                  headerStyle: { backgroundColor: colors.primary },
                  headerTintColor: colors.onPrimary,
                }} />
                <Stack.Screen name="WeighbridgeRepair" component={WeighbridgeRepair} options={{
                  title: 'Weighbridge Repair',
                  headerStyle: { backgroundColor: colors.primary },
                  headerTintColor: colors.onPrimary,
                }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{
                  title: 'Settings',
                  headerStyle: { backgroundColor: colors.primary },
                  headerTintColor: colors.onPrimary,
                }} />
                <Stack.Screen name="VinRegEntry" component={VinRegEntry} options={{
                  title: 'Enter VIN and REG',
                  headerStyle: { backgroundColor: colors.primary },
                  headerTintColor: colors.onPrimary,
                }} />
                <Stack.Screen name="ConfirmEmailPage" component={ConfirmEmailPage} options={{
                  title: 'Confirm Email',
                  headerStyle: { backgroundColor: colors.primary },
                  headerTintColor: colors.onPrimary,
                }} />
                <Stack.Screen name="WeighPads" component={WeighPads} options={{
                  title: 'Weigh Pads',
                  headerStyle: { backgroundColor: colors.primary },
                  headerTintColor: colors.onPrimary,
                }} />
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

export type ConfirmEmailPageProps = StackScreenProps<RootStackParamList, 'ConfirmEmailPage'>;