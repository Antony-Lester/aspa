
# Aspa
testing release
https://github.com/Antony-Lester/aspa/releases/download/v00.70/app-release.apk

-download
-settings > Install unknown apps > Allow from this source
-play protect > scan app if prompted

## Building a Release APK for Android

### Step 1: Generate a Release Keystore

1. Open a terminal and run the following command to generate a release keystore:
   ```sh
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Follow the prompts to set a password and other details.

### Step 2: Configure Gradle for Signing

1. Place the generated `my-release-key.keystore` file in the `android/app` directory.
2. Edit the `android/gradle.properties` file to include the following (replace the placeholders with your actual values):
   ```properties
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   ```
3. Edit the `android/app/build.gradle` file to add the signing configuration:
   ```gradle
   android {
       ...
       defaultConfig { ... }
       signingConfigs {
           release {
               if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                   storeFile file(MYAPP_RELEASE_STORE_FILE)
                   storePassword MYAPP_RELEASE_STORE_PASSWORD
                   keyAlias MYAPP_RELEASE_KEY_ALIAS
                   keyPassword MYAPP_RELEASE_KEY_PASSWORD
               }
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled enableProguardInReleaseBuilds
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

### Step 3: Build the Release APK

1. Open a terminal and navigate to the `android` directory of your project.
2. Run the following command to build the release APK:
   ```sh
   cd android
   ./gradlew assembleRelease
   ```
3. The generated APK will be located at `android/app/build/outputs/apk/release/app-release.apk`.

### Step 4: Deploy the APK

- You can now distribute the APK file or upload it to the Google Play Store.

## Implementing Building with GitHub Actions

### Step 1: Create a GitHub Actions Workflow

1. Create a `.github/workflows/android.yml` file in your repository with the following content:
   ```yaml
   name: Android Build

   on:
     push:
       branches:
         - main

   jobs:
     build:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout repository
           uses: actions/checkout@v2

         - name: Set up JDK 1.8
           uses: actions/setup-java@v1
           with:
             java-version: 1.8

         - name: Install dependencies
           run: npm install

         - name: Build Android app
           run: ./gradlew assembleRelease
   ```

### Step 2: Configure Secrets

1. In your GitHub repository, go to `Settings` > `Secrets` and add the following secrets:
   - `MYAPP_RELEASE_STORE_FILE`: Base64 encoded content of your `my-release-key.keystore` file.
   - `MYAPP_RELEASE_KEY_ALIAS`: Your key alias.
   - `MYAPP_RELEASE_STORE_PASSWORD`: Your keystore password.
   - `MYAPP_RELEASE_KEY_PASSWORD`: Your key password.

### Step 3: Base64 Encode Your Keystore

1. Use the following command to base64 encode your keystore file:
   ```sh
   base64 my-release-key.keystore > my-release-key.keystore.base64
   ```
2. Copy the content of the `my-release-key.keystore.base64` file and add it to the `MYAPP_RELEASE_STORE_FILE` secret in GitHub.

## Sideloading iOS App Using Diawi

### Step 1: Build the IPA File

1. Follow the steps to build an IPA file using Xcode or a CI/CD service like Bitrise.

### Step 2: Upload the IPA File to Diawi

1. Go to [Diawi](https://www.diawi.com/) and upload your IPA file.
2. Configure any additional settings if needed and click "Send".

### Step 3: Generate the Download Link

1. Diawi will process the IPA file and generate a download link.

### Step 4: Send the Download Link via Email

1. Compose an email and include the download link provided by Diawi.
2. Send the email to the intended recipients.

### Step 5: Install the App

1. The recipient opens the email on their iOS device and clicks the download link.
2. Safari will open, and the user can follow the prompts to install the app.

### Example Email Content

```markdown
Subject: Install Our iOS App

Hi,

Please use the link below to install our iOS app on your device:

[Download App](https://www.diawi.com/some-download-link)

1. Open this email on your iOS device.
2. Click the download link.
3. Follow the prompts in Safari to install the app.

Best regards,
Your Company
```

By following these steps, you can build a release APK for Android, implement building with GitHub Actions, and sideload an iOS app using Diawi.
```

### Summary

- **Building a Release APK for Android**:
  - Generate a release keystore.
  - Configure Gradle for signing.
  - Build the release APK.
  - Deploy the APK.

- **Implementing Building with GitHub Actions**:
  - Create a GitHub Actions workflow.
  - Configure secrets.
  - Base64 encode your keystore.

- **Sideloading iOS App Using Diawi**:
  - Build the IPA file.
  - Upload the IPA file to Diawi.
  - Generate the download link.
  - Send the download link via email.
  - Install the app.

By following these steps, you can build and deploy your Android and iOS apps, and sideload the iOS app using Diawi.


 (NOBRIDGE) LOG  First discovered peripheral: {"_manager": {"_activePromises": {}, "_activeSubscriptions": {}, "_errorCodesToMessagesMapping": {"0": "Unknown error occurred. This is probably a bug! Check reason property.", "1": "BleManager was destroyed", "100": "BluetoothLE is unsupported on this device", "101": "Device is not authorized to use BluetoothLE", "102": "BluetoothLE is powered off", "103": "BluetoothLE is in unknown state", "104": "BluetoothLE is resetting", "105": "Bluetooth state change failed", "2": "Operation was cancelled", "200": "Device {deviceID} connection failed", "201": "Device {deviceID} was disconnected", "202": "RSSI read failed for device {deviceID}", "203": "Device {deviceID} is already connected", "204": "Device {deviceID} not found", "205": "Device {deviceID} is not connected", "206": "Device {deviceID} could not change MTU size", "3": "Operation timed out", "300": "Services discovery failed for device {deviceID}", "301": "Included services discovery failed for device {deviceID} and service: {serviceUUID}", "302": "Service {serviceUUID} for device {deviceID} not found", "303": "Services not discovered for device {deviceID}", "4": "Operation was rejected", "400": "Characteristic discovery failed for device {deviceID} and service {serviceUUID}", "401": "Characteristic {characteristicUUID} write failed for device {deviceID} and service {serviceUUID}", "402": "Characteristic {characteristicUUID} read failed for device {deviceID} and service {serviceUUID}", "403": "Characteristic {characteristicUUID} notify change failed for device {deviceID} and service {serviceUUID}", "404": "Characteristic {characteristicUUID} not found", "405": "Characteristics not discovered for device {deviceID} and service {serviceUUID}", "406": "Cannot write to characteristic {characteristicUUID} with invalid data format: {internalMessage}", "5": "Invalid UUIDs or IDs were passed: {internalMessage}", "500": "Descriptor {descriptorUUID} discovery failed for device {deviceID}, service {serviceUUID} and characteristic {characteristicUUID}", "501": "Descriptor {descriptorUUID} write failed for device {deviceID}, service {serviceUUID} and characteristic {characteristicUUID}", "502": "Descriptor {descriptorUUID} read failed for device {deviceID}, service {serviceUUID} and characteristic {characteristicUUID}", "503": "Descriptor {descriptorUUID} not found", "504": "Descriptors not discovered for device {deviceID}, service {serviceUUID} and characteristic {characteristicUUID}", "505": "Cannot write to descriptor {descriptorUUID} with invalid data format: {internalMessage}", "506": "Cannot write to descriptor {descriptorUUID}. It's not allowed by iOS and therefore forbidden on Android as well.", "600": "Cannot start scanning operation", "601": "Location services are disabled"}, "_eventEmitter": {"_nativeModule": [Object]}, "_scanEventSubscription": {"remove": [Function remove]}, "_uniqueId": 2}, "id": "00:18:DA:40:5D:71", "isConnectable": true, "localName": "A-405D71", "manufacturerData": null, "mtu": 23, "name": "A-405D71", "overflowServiceUUIDs": null, "rawScanRecord": "AgEGEQcbxdWlAgA9leURUsMBAEBuCQlBLTQwNUQ3MQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=", "rssi": -93, "serviceData": null, "serviceUUIDs": ["6e400001-c352-11e5-953d-0002a5d5c51b"], "solicitedServiceUUIDs": null, "txPowerLevel": null}