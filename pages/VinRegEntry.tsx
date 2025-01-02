import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  StatusBarStyle,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useRoute, useNavigation, StackScreenProps } from '@react-navigation/native';
import useStyles from '../styles';
import { handleOpenMailApp } from '../utils/emailUtils';
import { deleteImage, recognizeVinInImage, savePicture } from '../utils/imageUtils';
import { useEmail } from '../EmailContext';
import { StatusBarContext } from '../App';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import SettingsButton from '../elements/SettingsButton';
import { useTheme } from '../ThemeContext';
import { useImages } from '../ImagesContext';
import { setItem, getItem } from '../storage';
import RNFS from 'react-native-fs';
import { requestStoragePermissions } from '../utils/permissionsUtils';
import TextRecognition from '@react-native-ml-kit/text-recognition';

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
  const [sendEmailButtonColor, setSendEmailButtonColor] = useState('red');
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

  const handleSend = async () => {
    const incompleteButtonIndex = buttonNames.findIndex((name, index) => images[index].length === 0 && getButtonBorderColor(index) === 'red');
    if (incompleteButtonIndex !== -1) {
      Alert.alert('Incomplete', `Please take a picture of ${buttonNames[incompleteButtonIndex]}.`);
      return;
    }

    if (!vin || vin.length < 6 || vin.length > 17) {
      navigation.navigate('VinRegEntry', { images, sourcePage: 'ObliInstall' });
      return;
    }

    const emailAddress = obliInstallEmail;
    if (!emailAddress) {
      Alert.alert('No Email Set', 'Please set an email address in the settings.', [
        { text: 'OK', onPress: () => navigation.navigate('Settings') },
      ]);
      return;
    }

    await handleOpenMailApp(vin, reg, emailAddress, buttonNames, images, getButtonBorderColor, navigation, 'ObliInstall');
    console.log('Navigating to ConfirmEmailPage...');
    navigation.navigate('ConfirmEmailPage', { vin, reg, emailAddress, images, sourcePage: 'ObliInstall' });
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

  useEffect(() => {
    if (routeImages) {
      setImages(routeImages);
    }
  }, [routeImages, setImages]);

  const isValidVinOrServiceCall = sourcePage === 'WeighbridgeRepair' || sourcePage === 'WeighbridgeInstall'
    ? vin.replace(/\s/g, '').length === 6
    : vin.replace(/\s/g, '').length >= 6 && vin.replace(/\s/g, '').length <= 17;

  const isValidReg = sourcePage === 'WeighbridgeInstall' || sourcePage === 'WeighbridgeRepair'
    ? reg.replace(/\s/g, '').length === 4 || reg === ''
    : true;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={colors.statusBarStyle as StatusBarStyle} backgroundColor={colors.primary} />
      <View style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {sourcePage === 'WeighbridgeInstall' || sourcePage === 'WeighbridgeRepair'
                ? 'Service Call S/C'
                : 'Vehicle Identification Number VIN'}
            </Text>
            {detectedVin ? (<Text style={styles.detectedVin}>{detectedVin}</Text>) : null}
            <TextInput
              style={[styles.input, { borderColor: isValidVinOrServiceCall ? 'green' : 'red' }]}
              value={vin}
              onChangeText={setVin}
              placeholder={sourcePage === 'WeighbridgeInstall' || sourcePage === 'WeighbridgeRepair'
                ? 'Enter Service Call S/C'
                : 'Enter Vehicle Identification Number VIN'}
              placeholderTextColor={colors.placeholder}
              keyboardType={sourcePage === 'WeighbridgeInstall' || sourcePage   {detectedVin ? (<Text style={styles.detectedVin}>{detectedVin}</Text>) : null}=== 'WeighbridgeRepair' ? 'numeric' : 'default'}
              maxLength={sourcePage === 'WeighbridgeInstall' || sourcePage === 'WeighbridgeRepair' ? 6 : 17}
            />
          </View>
          {(sourcePage === 'WeighbridgeInstall' || sourcePage === 'WeighbridgeRepair') && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Serial Number S/N (Optional):</Text>
              <TextInput
                style={[styles.input, { borderColor: reg ? (isValidReg ? 'green' : 'red') : 'orange' }]}
                value={reg}
                onChangeText={setReg}
                placeholder="Enter Serial Number S/N"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          )}
          {(sourcePage === 'ObliInstall' || sourcePage === 'ObliRepair') && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Registration Number (Optional):</Text>
              <TextInput
                style={[styles.input, { borderColor: reg ? 'green' : 'orange' }]}
                value={reg}
                onChangeText={setReg}
                placeholder="Enter Registration Number"
                placeholderTextColor={colors.placeholder}
              />
            </View>
          )}
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.bottomButton, { borderColor: sendEmailButtonColor }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VinRegEntry;