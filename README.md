
# Aspa
testing release
https://github.com/Antony-Lester/aspa/releases/download/testing/app-release.apk

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