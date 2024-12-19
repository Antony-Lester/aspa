import React from 'react';
import { View, Text } from 'react-native';
import useStyles from '../styles'; // Import useStyles

const ObliRepair = () => {
  const styles = useStyles(); // Use styles

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Obli Repair Page</Text>
    </View>
  );
};

export default ObliRepair;