import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const WeighPadsButton = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.background }]}
      onPress={() => {
        navigation.navigate('WeighPads' as never);
      }}
    >
      <Text style={[styles.buttonText, { color: colors.onPrimary }]}>⚖️</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 28,
  },
});

export default WeighPadsButton;