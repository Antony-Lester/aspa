import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  StatusBarStyle,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useRoute, useNavigation, StackScreenProps } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import useStyles from '../styles';
import { handleOpenMailApp } from '../utils/emailUtils';
import { deleteImage } from '../utils/imageUtils';
import { useEmail } from '../EmailContext';
import { StatusBarContext } from '../App';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import SettingsButton from '../elements/SettingsButton';
import { useTheme } from '../ThemeContext';
import { useImages } from '../ImagesContext';
import { setItem, getItem } from '../storage';

type RootStackParamList = {
  VinRegEntry: { images: string[][]; sourcePage: string };
};

type VinRegEntryProps = StackScreenProps<RootStackParamList, 'VinRegEntry'>;

const VinRegEntry: React.FC<VinRegEntryProps> = ({ navigation, route }) => {
  const { images: routeImages, sourcePage } = route.params || {};
  const { colors } = useTheme();
  const styles = useStyles();
  const { obliInstallEmail, obliRepairEmail, weighbridgeRepairEmail, weighbridgeInstallEmail } = useEmail();
  const { images, setImages } = useImages();
  const [vin, setVin] = useState('');
  const [reg, setReg] = useState('');
  const [emailOpened, setEmailOpened] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [chassisPlateUri, setChassisPlateUri] = useState('');
  const [sendEmailButtonColor, setSendEmailButtonColor] = useState('red');
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const { setStatusBarColor, setNavigationBarColor } = useContext(StatusBarContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: colors.onPrimary,
      headerRight: () => <SettingsButton />,
    });
  }, [navigation, colors]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor(colors.primary);
      StatusBar.setBarStyle(colors.statusBarStyle as StatusBarStyle);
      SystemNavigationBar.setNavigationColor(colors.primary, undefined);
    }, [colors])
  );

  useEffect(() => {
    setStatusBarColor(colors.primary);
    setNavigationBarColor(colors.primary);
  }, [colors, setStatusBarColor, setNavigationBarColor]);

  useEffect(() => {
    const suggestVinAndReg = async () => {
      for (const imageArray of images) {
        for (const imageUri of imageArray) {
          // Your existing logic here...
        }
      }
    };

    suggestVinAndReg();
  }, [images]);

  useEffect(() => {
    const isValidVinOrServiceCall = sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall'
      ? vin.replace(/\s/g, '').length === 6
      : vin.replace(/\s/g, '').length >= 6 && vin.replace(/\s/g, '').length <= 17;
    setSendEmailButtonColor(isValidVinOrServiceCall ? 'green' : 'red');
  }, [vin, sourcePage]);

  const getEmailAddress = () => {
    switch (sourcePage) {
      case 'ObliInstall':
        return obliInstallEmail;
      case 'ObliRepair':
        return obliRepairEmail;
      case 'WeighbridgeInstall':
        return weighbridgeInstallEmail;
      case 'WeighbridgeRepair':
        return weighbridgeRepairEmail;
      default:
        return '';
    }
  };

  const handleDeleteAllImages = async () => {
    console.log('Deleting all images...');
    for (const imageArray of images) {
      for (const imageUri of imageArray) {
        await deleteImage({ uri: imageUri, index: images.indexOf(imageArray) }, images, setImages);
      }
    }
    console.log('All images deleted.');
    navigation.navigate('Home');
  };

  useFocusEffect(
    React.useCallback(() => {
      const showAlert = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const emailAddress = getEmailAddress();
        console.log('Checking if alert should be shown...');
        console.log('emailOpened:', emailOpened);
        console.log('emailSent:', emailSent);
        console.log('emailAddress:', emailAddress);
        if (!emailOpened && !emailSent && emailAddress) {
          Alert.alert(
            'Send Email',
            `Do you want to send the images to ${emailAddress}?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  setEmailOpened(true);
                },
              },
            ],
            { cancelable: false }
          );
        }
      };

      showAlert();
    }, [emailOpened, emailSent, getEmailAddress])
  );

  const handleSave = async () => {
    const formattedVinOrServiceCall = vin.replace(/\s/g, '');
    if ((sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall') && formattedVinOrServiceCall.length !== 6) {
      Alert.alert('Invalid Service Call', 'Please enter a valid Service Call number.');
      return;
    } else if (formattedVinOrServiceCall.length < 6 || formattedVinOrServiceCall.length > 17) {
      Alert.alert('Invalid VIN', 'Please enter a valid VIN number.');
      return;
    }

    const emailAddress = getEmailAddress();
    if (!emailAddress) {
      Alert.alert('No Email Set', 'Please set an email address in the settings.', [
        { text: 'OK', onPress: () => navigation.navigate('Settings') },
      ]);
      return;
    }

    console.log('Formatted VIN or Service Call:', formattedVinOrServiceCall);

    let subject = `${new Date().toISOString().split('T')[0]} ${vin} ${reg || ''}`;
    let body = 'Attached are the images.';
    if (sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall') {
      subject = `${new Date().toISOString().split('T')[0]} SC${formattedVinOrServiceCall}` + (reg ? ` S/N${reg}` : '');
      body = `Attached are the images for SC${formattedVinOrServiceCall}` + (reg ? ` S/N${reg}` : '');
    }

    console.log('Calling handleOpenMailApp...');
    await handleOpenMailApp(formattedVinOrServiceCall, reg, emailAddress, ['Chassis Plate', 'Reg Plate'], images, () => 'green', navigation, sourcePage);
    setEmailSent(true);
    setEmailOpened(true);
    console.log('Email sent and navigating to confirmation page.');
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigation.navigate('ConfirmEmailPage', { vin: formattedVinOrServiceCall, reg, emailAddress, images, sourcePage });
  };

  const handleImageLayout = (event: { nativeEvent: { layout: { width: any; height: any; }; }; }) => {
    const { width, height } = event.nativeEvent.layout;
    setImageAspectRatio(width / height);
  };

  useEffect(() => {
    const loadSettings = () => {
      const storedVin = getItem('vin');
      const storedReg = getItem('reg');
      if (storedVin) setVin(storedVin);
      if (storedReg) setReg(storedReg);
    };

    loadSettings();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>VIN:</Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={setVin}
            placeholder="Enter VIN"
            placeholderTextColor="gray"
          />
          <Text style={styles.label}>Registration (Optional):</Text>
          <TextInput
            style={styles.input}
            value={reg}
            onChangeText={setReg}
            placeholder="Enter Registration"
            placeholderTextColor="gray"
          />
        </View>
        <View style={[styles.bottomButtonContainer, { backgroundColor: colors.primary }]}>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              {
                borderColor: sendEmailButtonColor,
                backgroundColor: colors.primary,
                borderWidth: sendEmailButtonColor === 'green' ? 10 : 3,
              },
            ]}
            onPress={handleSave}
          >
            <Text style={[styles.bottomButtonText, { color: colors.onPrimary }]}>Send</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VinRegEntry;