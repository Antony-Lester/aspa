import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext'; // Import useTheme

const useStyles = () => {
  const { colors } = useTheme(); // Use theme colors

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
      padding: 16,
    },
    settingsButton: {
      position: 'absolute',
      top: 5,
      right: 5,
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
      width: '80%',
      padding: 10,
      marginVertical: 5,
      backgroundColor: colors.onSecondary, // Use theme primary color
      borderRadius: 35,
      borderWidth: 6, // Increase border width
      borderColor: colors.tertiaryContainer, // Use theme primaryContainer color
      shadowColor: colors.shadow, // Use theme shadow color
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    buttonText: {
      color: colors.onTertiary, // Use theme onPrimary color
      fontSize: 20,
      fontWeight: 'bold', // Make text bold
      textAlign: 'center',
      flex: 1,
    },
    plusIcon: {
      color: colors.onPrimary, // Use theme onPrimary color
      fontSize: 24,
      marginRight: 10,
    },
    plusIconPlaceholder: {
      width: 24, // Same width as the plus icon
      height: 32, // Same height as the plus icon
      marginRight: 10,
    },
    thumbnailContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center', // Center align items vertically
      marginTop: 10,
    },
    thumbnail: {
      width: 150,
      height: 150,
      margin: 5,
      borderRadius: 20,
      borderWidth: 2, // Add border width
      borderColor: colors.primary, // Use theme primary color for border
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
      backgroundColor: colors.primary, // Use theme primary color for background
    },
    bottomButton: {
      padding: 10, // Increase padding
      borderRadius: 35, // Increase border radius
      borderWidth: 5, // Increase border width
      borderColor: colors.outline, // Use theme secondary color
      elevation: 0, // Increase elevation
      alignItems: 'center', // Center the text within the button
      justifyContent: 'center', // Center the text within the button
      marginVertical: 5, // Add vertical margin
      alignSelf: 'center', // Center the button horizontally
      width: '80%', // Set button width
      backgroundColor: colors.primary, // Use theme onPrimary color for text
    },
    bottomButtonText: {
      color: colors.surfaceBright, // Use theme onPrimary color for text
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
  });
};

export default useStyles;

