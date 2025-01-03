import React, { useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';

import { ConfirmEmailPageProps } from '../App';
import { useTheme } from '../ThemeContext';
import useStyles from '../styles';
import { handleOpenMailApp } from '../utils/emailUtils';
import { deleteImage } from '../utils/imageUtils';
import SettingsButton from '../elements/SettingsButton';
import { setItem } from '../storage';

const ConfirmEmailPage: React.FC<ConfirmEmailPageProps> = ({ navigation, route }) => {
  const { vin, reg, emailAddress, images, sourcePage } = route.params;
  const { colors } = useTheme();
  const styles = useStyles();
  const nav = navigation;

  useLayoutEffect(() => {
    nav.setOptions({
      headerStyle: { backgroundColor: colors.primary, },
      headerTintColor: colors.onPrimary,
      headerRight: () => <SettingsButton />,
    });
  }, [nav, colors]);

  const handleDeleteAllImages = async () => {
    for (const imageArray of images) {
      for (const imageUri of imageArray) {
        console.log(`Deleting image: ${imageUri}`);
        try {
          deleteImage({ uri: imageUri, index: images.indexOf(imageArray) });
        } catch (error) {
          console.error(`Failed to delete image: ${imageUri}`, error);
        }
      }
    }
  };

  const handleYesPress = async () => {
    console.log('User confirmed email sent. Deleting all images... & Resetting state...');
    await handleDeleteAllImages();
    setItem('detectedVin', '');
    setItem('detectedReg', '');
    setItem('vin', '');
    setItem('reg', '');
    nav.navigate('Home');
  }

  const handleNoPress = async () => {
    console.log('User confirmed email not sent. Resending email...');
    await handleOpenMailApp(vin, reg, emailAddress, ['Chassis Plate', 'Reg Plate'], images, () => 'green', nav, sourcePage);
  };

  return (
    <SafeAreaView style={styles.emailContainer}>
      <View style={styles.emailContent}>
        <Text style={styles.emailTitle}>Have You sent the email?</Text>
        <View style={styles.emailButtonContainer}>
          <TouchableOpacity style={styles.emailYesButton} onPress={handleYesPress}>
            <Text style={styles.emailButtonText}>Yes</Text> </TouchableOpacity>
          <TouchableOpacity style={styles.emailNoButton} onPress={handleNoPress}>
            <Text style={styles.emailButtonText}>No</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>)
};

export default ConfirmEmailPage;