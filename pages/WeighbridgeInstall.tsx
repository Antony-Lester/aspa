import React from 'react';
import { View, Text } from 'react-native';
import useStyles from '../styles'; // Import useStyles

const WeighbridgeInstall = () => {
  const styles = useStyles(); // Use styles

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weighbridge Install Page</Text>
    </View>
  );
};

export default WeighbridgeInstall;