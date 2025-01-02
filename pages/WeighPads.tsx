import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StatusBar, Alert, FlatList, StatusBarStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useTheme } from '../ThemeContext';
import { StatusBarContext } from '../App';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { requestBluetoothPermissions } from '../utils/permissionsUtils';
import { BleManager, Device } from 'react-native-ble-plx';

const WeighPads = () => {
  const { colors } = useTheme();
  const { setStatusBarColor, setNavigationBarColor } = useContext(StatusBarContext);
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const manager = new BleManager();

  useEffect(() => {
    setStatusBarColor(colors.primary);
    setNavigationBarColor(colors.primary);
    changeNavigationBarColor(colors.primary, true);

    const checkBluetoothStatus = async () => {
      try {
        const state = await manager.state();
        if (state !== 'PoweredOn') {
          Alert.alert('Bluetooth Disabled', 'Please enable Bluetooth to use this feature.');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error checking Bluetooth status:', error);
        return false;
      }
    };

    const requestPermissions = async () => {
      const bluetoothPermission = await requestBluetoothPermissions();
      if (!bluetoothPermission) {
        Alert.alert('Permission Denied', 'Bluetooth permissions are required to use this feature.');
        return false;
      }
      return true;
    };

    

    const handleDiscoverPeripheral = (device: Device) => {
      if (device.isConnectable) {
        setDevices((prevDevices) => {
          if (!prevDevices.some((d) => d.id === device.id)) {
            if (prevDevices.length === 0) {
              console.log('First discovered peripheral:', device);
            }
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    };

    const startScan = () => {
      if (!scanning) {
        setScanning(true);
        manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.error('Scan error:', error);
            setScanning(false);
            return;
          }
          if (device) {
            handleDiscoverPeripheral(device);
          }
        });
      }
    };

    const continuousScan = async () => {
      const bluetoothStatus = await checkBluetoothStatus();
      const permissionsGranted = await requestPermissions();
      if (bluetoothStatus && permissionsGranted) {
        startScan();
        if (devices.length === 0) {
          setTimeout(continuousScan, 5000); // Adjust the interval as needed
        }
      }
    };

    continuousScan();

    return () => {
      manager.stopDeviceScan();
    };
  }, [colors, setStatusBarColor, setNavigationBarColor, devices]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor(colors.primary);
      StatusBar.setBarStyle(colors.statusBarStyle as StatusBarStyle);
      SystemNavigationBar.setNavigationColor(colors.primary, undefined);
    }, [colors])
  );

  return (
    <View>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name || 'Unnamed Device'}</Text>
            <Text>{item.id}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default WeighPads;