import React, { useEffect, createContext, useContext, useState } from 'react';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './pages/Home'; // Correctly import HomeScreen
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
import useStyles from './styles'; // Import useStyles

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
    const loadInitialRoute = async () => {
      const savedRoute = await AsyncStorage.getItem('currentRoute');
      if (savedRoute) {
        setInitialRouteName(savedRoute);
      }
    };
    loadInitialRoute();
  }, []);

  const handleStateChange = async (state: any) => {
    const currentRoute = state.routes[state.index].name;
    await AsyncStorage.setItem('currentRoute', currentRoute);
  };

  return (
    <ThemeProvider>
      <EmailProvider>
        <ImagesProvider>
          <StatusBarContext.Provider value={{ setStatusBarColor, setNavigationBarColor }}>
            <NavigationContainer onStateChange={handleStateChange}>
              <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Obli Install" component={ObliInstall} options={{ title: 'Obli Install' }} />
                <Stack.Screen name="Obli Repair" component={ObliRepair} options={{ title: 'Obli Repair' }} />
                <Stack.Screen name="Weighbridge Install" component={WeighbridgeInstall} options={{ title: 'Weighbridge Install' }} />
                <Stack.Screen name="Weighbridge Repair" component={WeighbridgeRepair} options={{ title: 'Weighbridge Repair' }} />
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