# Aspa App Documentation

## Overview

Aspa is a React Native application designed to capture and manage images related to various components of a vehicle. The app allows users to take photos, view them in a gallery, and send them via email. It also supports theme customization and email configuration.

## Features

1. **Image Capture**:
   - Users can capture images for different vehicle components such as Front Sensor(s), Rear Sensor(s), T Piece Locations, etc.
   - The app uses the device's camera to take photos and stores them in the app.

2. **Image Gallery**:
   - Captured images are displayed in a gallery format.
   - Users can view images in full-screen mode and delete them if necessary.

3. **Email Integration**:
   - Users can configure an email address to send the captured images.
   - The app provides a button to open the default mail app with a pre-filled email containing the images as attachments.

4. **Theme Customization**:
   - Users can select different themes (Default, Light, Dark, High Contrast) to customize the app's appearance.
   - The selected theme is applied throughout the app.

5. **Settings Screen**:
   - Users can configure their email address and select a theme from the settings screen.

## Technical Details

### Technology Stack

- **React Native**: For building the cross-platform mobile application.
- **React Navigation**: For handling navigation between screens.
- **React Native Image Picker**: For capturing images using the device's camera.
- **React Native Email**: For integrating email functionality.
- **Context API**: For managing theme and email configurations.

### Project Structure

- **App.tsx**: The main entry point of the application. It sets up the navigation and theme provider.
- **HomeScreen.tsx**: The main screen where users can capture images and view the gallery.
- **SettingsScreen.tsx**: The settings screen where users can configure their email address and select a theme.
- **ThemeContext.tsx**: Manages the theme configuration using React Context API.
- **styles.ts**: Contains the styles for the app, which are dynamically applied based on the selected theme.

### Key Components

1. **HomeScreen**:
   - Displays buttons for capturing images for different vehicle components.
   - Shows a gallery of captured images.
   - Provides a button to send the images via email.

2. **SettingsScreen**:
   - Allows users to enter and save their email address.
   - Provides options to select and apply different themes.

3. **ThemeContext**:
   - Manages the theme state and provides functions to change the theme.
   - Ensures that the selected theme is applied throughout the app.

### Configuration

- **Android**:
  - The app is configured to use a minimum SDK version of 24.
  - The `AndroidManifest.xml` file includes necessary permissions and configurations for the app.

- **iOS**:
  - The app is configured with necessary settings in the `Info.plist` file.
  - The Xcode project is set up to build and run the app on iOS devices.

### Running the App

1. **Start the Metro Server**:
   ```bash
   npx react-native start
   ```

2. **Run on Android**:
   ```bash
   npx react-native run-android
   ```

3. **Run on iOS**:
   ```bash
   npx react-native run-ios
   ```

### Troubleshooting

- If you encounter issues, refer to the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting).

### Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)
- [React Native Image Picker Documentation](https://github.com/react-native-image-picker/react-native-image-picker)
- [React Native Email Documentation](https://github.com/chirag04/react-native-mail)

---

This high-level documentation provides an overview of the Aspa app, its features, technical details, and instructions for running the app.