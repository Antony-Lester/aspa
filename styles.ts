import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext'; // Import useTheme

const useStyles = () => {
  const { colors } = useTheme(); // Use theme colors

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      backgroundColor: colors.background, // Use theme background color
    },
    scrollView: {
      backgroundColor: colors.background, // Use theme background color
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
      padding: 16,
      paddingTop: 50, // Add 10 more padding to the top
    },
    buttonWrapper: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
    button: {
      width: '98%',
      padding: 15,
      marginVertical: 10,
      backgroundColor: colors.primary, // Use theme primary color
      borderRadius: 35,
      borderWidth: 5, // Increase border width
      borderColor: colors.primaryContainer, // Use theme primaryContainer color
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 10,
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
      color: colors.onPrimary, // Use theme onPrimary color
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
      marginTop: 10,
    },
    thumbnail: {
      width: 100,
      height: 100,
      margin: 5,
      borderRadius: 20,
    },
    bottomButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center', // Center the button horizontally
      padding: 16,
      position: 'absolute',
      bottom: 0,
      left: 0, // Ensure the container fills the screen width
      right: 0, // Ensure the container fills the screen width
      backgroundColor: colors.surface, // Use theme surface color
    },
    bottomButton: {
      width: '90%',
      padding: 10, // Increase padding
      backgroundColor: colors.secondary, // Use theme secondary color
      borderRadius: 35, // Increase border radius
	  borderWidth: 5, // Increase border width
	  borderColor: colors.onSecondaryFixedVariant, // Use theme secondary color
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 }, // Increase shadow offset
      shadowOpacity: 0.9, // Increase shadow opacity
      shadowRadius: 4, // Increase shadow radius
      elevation: 10, // Increase elevation
      alignItems: 'center', // Center the text within the button
      justifyContent: 'center', // Center the text within the button
    },
    bottomButtonText: {
      color: colors.onSecondary, // Use theme onSecondary color
      fontSize: 20, // Increase font size
      fontWeight: 'bold', // Make text bold
    },
    fullScreenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    fullScreenImage: {
      width: '90%',
      height: '80%',
      borderRadius: 50,
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
      position: 'absolute',
      bottom: 20,
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
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 8,
      color: colors.onBackground, // Use theme onBackground color
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
    picker: {
      height: 50,
      width: '100%',
      color: colors.onBackground, // Use theme onBackground color
      backgroundColor: colors.surface, // Use theme surface color
    },
  });
};

export default useStyles;