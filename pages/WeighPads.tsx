import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StatusBar, Alert, FlatList, StatusBarStyle, ScrollView } from 'react-native';
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
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [receivedData, setReceivedData] = useState<string[]>([]);
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
      if (!device.name) {
        return; // Ignore devices without a name
      }
      console.log('Discovered peripheral:', device);
      if (device.name === 'Prot3') {
        connectToDevice(device);
      }
      setDevices((prevDevices) => {
        if (!prevDevices.some((d) => d.id === device.id)) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    };

    const connectToDevice = async (device: Device) => {
      try {
        await manager.stopDeviceScan();
        const connectedDevice = await device.connect();
        console.log('Connected to device:', connectedDevice);
        setConnectedDevice(connectedDevice);
        await connectedDevice.discoverAllServicesAndCharacteristics();
        console.log('Discovered services and characteristics');
        // Subscribe to notifications or read characteristics as needed
        connectedDevice.monitorCharacteristicForService(
          'service-uuid', // Replace with your service UUID
          'characteristic-uuid', // Replace with your characteristic UUID
          (error, characteristic) => {
            if (error) {
              console.error('Error monitoring characteristic:', error);
              return;
            }
            if (characteristic?.value) {
              const data = Buffer.from(characteristic.value, 'base64').toString('utf-8');
              console.log('Received data:', data);
              setReceivedData((prevData) => [...prevData, data]);
            }
          }
        );
      } catch (error) {
        console.error('Failed to connect to device:', error);
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
            <Text>{item.name}</Text>
            <Text>{item.id}</Text>
          </View>
        )}
      />
      {connectedDevice && (
        <ScrollView>
          <Text>Connected to: {connectedDevice.name}</Text>
          {receivedData.map((data, index) => (
            <Text key={index}>{data}</Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default WeighPads;