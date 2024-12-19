import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStyles from '../styles'; // Import useStyles

const HomePage = () => {
  const navigation = useNavigation();
  const styles = useStyles(); // Use styles

  return (
    <View style={styles.homeButtonContainer}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('ObliInstall')}
      >
        <Text style={styles.bottomButtonText}>Obli Install</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('ObliRepair')}
      >
        <Text style={styles.bottomButtonText}>Obli Repair</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('WeighbridgeInstall')}
      >
        <Text style={styles.bottomButtonText}>Weighbridge Install</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('WeighbridgeRepair')}
      >
        <Text style={styles.bottomButtonText}>Weighbridge Repair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomePage;