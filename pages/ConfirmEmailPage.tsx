import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import useStyles from '../styles'; // Import useStyles
import { handleOpenMailApp } from '../utils/emailUtils'; // Import handleOpenMailApp
import { deleteImage } from '../utils/imageUtils'; // Import deleteImage

type ConfirmEmailPageProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { vin: string; reg: string; emailAddress: string; images: string[][]; sourcePage: string } }, 'params'>;
};

const ConfirmEmailPage = ({ navigation, route }: ConfirmEmailPageProps) => {
  const { vin, reg, emailAddress, images, sourcePage } = route.params;
  const styles = useStyles();

  const handleDeleteAllImages = async () => {
    console.log('Deleting all images...');
    for (const imageArray of images) {
      for (const imageUri of imageArray) {
        console.log(`Deleting image: ${imageUri}`);
        try {
          await deleteImage({uri: imageUri, index: images.indexOf(imageArray)});
        } catch (error) {
          console.error(`Failed to delete image: ${imageUri}`, error);
        }
      }
    }
    console.log('All images deleted.');
    // Navigate to Home screen
    navigation.navigate('Home');
  };

  const handleNoPress = async () => {
    console.log('User confirmed email not sent. Resending email...');
    await handleOpenMailApp(vin, reg, emailAddress, ['Chassis Plate', 'Reg Plate'], images, () => 'green', navigation, sourcePage);
  };

  return (
    <SafeAreaView style={styles.emailContainer}>
      <View style={styles.emailContent}>
        <Text style={styles.emailTitle}>Have You sent the email?</Text>
        <View style={styles.emailButtonContainer}>
          <TouchableOpacity
            style={styles.emailYesButton}
            onPress={handleDeleteAllImages}
          >
            <Text style={styles.emailButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emailNoButton}
            onPress={handleNoPress}
          >
            <Text style={styles.emailButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmEmailPage;