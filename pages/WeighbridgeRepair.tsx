import React from 'react';
import { View, Text } from 'react-native';
import useStyles from '../styles'; // Import useStyles

const WeighbridgeRepair = () => {
  const styles = useStyles(); // Use styles

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weighbridge Repair Page</Text>
    </View>
  );
};

export default WeighbridgeRepair;