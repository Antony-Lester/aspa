import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import useStyles from '../styles'; // Import useStyles

type RootStackParamList = {
  // const navigation = useNavigation();
  'Obli Repair': undefined;
  'Obli Install': undefined;
  'Weighbridge Install': undefined;
  'Weighbridge Repair': undefined;
};

  const HomePage: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const styles = useStyles(); // Use styles

  return (
    <View style={styles.homeButtonContainer}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('Obli Install')}
      >
        <Text style={styles.bottomButtonText}>Obli Install</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('Obli Repair')}
      >
        <Text style={styles.bottomButtonText}>Obli Repair</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('Weighbridge Install')}
      >
        <Text style={styles.bottomButtonText}>Weighbridge Install</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('Weighbridge Repair')}
      >
        <Text style={styles.bottomButtonText}>Weighbridge Repair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomePage;