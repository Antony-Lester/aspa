import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext'; // Import useTheme

const useStyles = () => {
  const { colors } = useTheme(); // Use theme colors
  const screenWidth = Dimensions.get('window').width; // Get the screen width

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      backgroundColor: colors.secondary, // Use theme background color
    },
    scrollView: {
      backgroundColor: colors.secondary, // Use theme background color
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center', // Center align items horizontally
      padding: 16,
    },
    settingsButton: {
      position: 'absolute',
      top: 0,
      right: 10,
      padding: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.0)', // Translucent background
      borderRadius: 5,
      zIndex: 1,
    },
    settingsButtonText: {
      fontSize: 35,
      color: colors.onPrimary, // Use theme onPrimary color
    },
    buttonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
    },
    buttonWrapper: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 25,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow, 
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.9,
      shadowRadius: 4,
      elevation: 10,
      borderWidth: 3, 
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    buttonText: {
      color: colors.onPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
    },
    plusIcon: {
      color: colors.onPrimary,
      fontSize: 24,
      marginRight: 10,
    },
    plusIconPlaceholder: {
      width: 24,
      height: 32,
      marginRight: 10,
    },
    thumbnailContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center', 
      marginTop: 10,
    },
    thumbnail: {
      width: 150,
      height: 150,
      margin: 5,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    thumbnailWrapper: {
      margin: 5,
      borderRadius: 10,
      overflow: 'hidden',
    },
    bottomButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center', // Center the button horizontally
      paddingTop: 10,
      position: 'absolute',
      bottom: 0,
      left: 0, // Ensure the container fills the screen width
      right: 0, // Ensure the container fills the screen width
      backgroundColor: colors.tertiary, // Use theme primary color for background
      shadowColor: colors.shadow, // Add shadow color
      shadowOffset: { width: 0, height: -10 }, // Increase shadow offset
      shadowOpacity: 0.8, // Increase shadow opacity
      shadowRadius: 10, // Increase shadow radius
      elevation: 30, // Increase elevation for Android
    },
    bottomButton: {
      padding: 10, // Increase padding
      borderRadius: 35, // Increase border radius
      borderWidth: 3, // Increase border width
      borderColor: colors.onTertiary, // Use theme secondary color
      elevation: 0, // Increase elevation
      alignItems: 'center', // Center the text within the button
      justifyContent: 'center', // Center the text within the button
      marginVertical: 5, // Add vertical margin
      alignSelf: 'center', // Center the button horizontally
      width: '80%', // Set button width
      backgroundColor: colors.tertiaryContainer, // Use theme onPrimary color for text
    },
    bottomButtonText: {
      color: colors.onTertiaryContainer, // Use theme onPrimary color for text
      fontSize: 20, // Increase font size
      fontWeight: 'bold',
    },
    fullScreenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    fullScreenImage: {
      borderRadius: 20,
      alignSelf: 'center', // Center the image horizontally
    },
    deleteButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      backgroundColor: colors.error, // Use theme error color
      padding: 10,
      borderRadius: 5,
    },
    deleteButtonText: {
      color: colors.onError, // Use theme onError color
      fontSize: 16,
    },
    closeButton: {
      backgroundColor: 'gray',
      padding: 10,
      borderRadius: 5,
    },
    closeButtonText: {
      color: colors.onSurface, // Use theme onSurface color
      fontSize: 16,
    },
    label: {
      fontSize: 20, // Increase font size
      fontWeight: 'bold', // Make text bold
      marginBottom: 8,
      color: colors.onBackground, // Use theme onBackground color
    },
    input: {
      height: 50, // Increase height
      fontSize: 18, // Increase font size
      borderColor: colors.onSecondaryFixedVariant, // Use theme primary color for border
      borderWidth: 2, // Increase border width
      borderRadius: 10, // Add border radius
      paddingHorizontal: 10, // Add horizontal padding
      backgroundColor: colors.secondaryContainer, // Use theme surface color
      color: colors.onBackground, // Use a lighter color for the input text
      marginBottom: 16, // Add margin bottom
      shadowColor: '#000', // Add shadow for better contrast
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    vinLabel: {
      fontSize: 20, // Increase font size
      fontWeight: 'bold', // Make text bold
      marginBottom: 8,
      color: colors.onSecondary, // Use theme onBackground color
      alignSelf: 'flex-start', // Align text to the left
    },
    vinInput: {
      height: 50, // Increase height,
      width: '100%', // Full width of the screen
      fontSize: 18, // Increase font size
      borderColor: colors.onSecondaryFixedVariant, // Use theme primary color for border
      borderWidth: 2, // Increase border width
      borderRadius: 10, // Add border radius
      paddingHorizontal: 10, // Add horizontal padding
      backgroundColor: colors.secondaryContainer, // Use theme surface color
      color: colors.onSecondaryContainer, // Use a lighter color for the input text
      marginBottom: 16, // Add margin bottom
      shadowColor: '#000', // Add shadow for better contrast
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    picker: {
      height: 50,
      width: '100%',
    },
    saveButton: {
      backgroundColor: colors.secondary, // Use theme secondary color
      padding: 15,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.9,
      shadowRadius: 4,
      elevation: 10,
    },
    saveButtonText: {
      color: colors.onSecondary, // Use theme onSecondary color
      fontSize: 18,
      fontWeight: 'bold',
    },
    permissionMessageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background, // Use theme background color
    },
    permissionMessageText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.onBackground, // Use theme onBackground color
    },
    homeButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.secondary, // Use theme background color
    },
    logo: {
      width: '80%', // Set width to 50% of the screen width
      height: undefined, // Maintain aspect ratio
      aspectRatio: 1, // Ensure the logo is square
      marginBottom: 20, // Add margin to the logo
    },
    chassisPlateContainer: {
      width: '100%', // Full width of the screen
      flex: 1,
      backgroundColor: colors.secondary, // Use theme background color
    },
    chassisPlateImage: {
      width: screenWidth - 5, // Set the width to the screen width minus padding
      minHeight: 200, // Set a minimum height for the image
      marginBottom: 20, // Add margin below the image
    },
  });
};

export default useStyles;

