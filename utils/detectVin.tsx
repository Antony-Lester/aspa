import TextRecognition from '@react-native-ml-kit/text-recognition';
import { setItem } from '../storage';

const validateVIN = (vin: string) => {
    if (typeof vin !== 'string') {
        return false;
    }

    // Check length
    if (vin.length !== 17) {
        return false;
    }

    // Check for invalid characters
    const invalidChars = ['I', 'O', 'Q'];
    for (const char of vin) {
        if (invalidChars.includes(char)) {
            return false;
        }
    }

    // VIN character weights
    const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

    // VIN character values
    const transliterations: { [key: string]: number } = {
        A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
        1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 0: 0
    };

    // Calculate the check digit
    let sum = 0;
    for (let i = 0; i < vin.length; i++) {
        const char = vin[i];
        const value = transliterations[char as keyof typeof transliterations];
        const weight = weights[i];
        sum += value * weight;
    }

    const checkDigit = vin[8];
    const calculatedCheckDigit = sum % 11 === 10 ? 'X' : (sum % 11).toString();

    return checkDigit === calculatedCheckDigit;
};

const validatePartialVIN = (vin: string) => {
    if (typeof vin !== 'string') {
        return false;
    }

    // Check length
    if (vin.length < 6 || vin.length > 17) {
        return false;
    }

    // Check for invalid characters
    const invalidChars = ['I', 'O', 'Q'];
    for (const char of vin) {
        if (invalidChars.includes(char)) {
            return false;
        }
    }

    return true;
};

export const recognizeVinInImage = async (imageUri: string, setDetectedVin: (vin: string) => void) => {
    try {
        const result = await TextRecognition.recognize(imageUri);
        console.log('Recognized text:', result.text);

        let detectedVIN = '';

        for (const block of result.blocks) {
            for (const line of block.lines) {
                const cleanedText = line.text.replace(/[\s\n\t]/g, '');
                if (cleanedText.length === 17 && validateVIN(cleanedText)) {
                    console.log(`Detected VIN: ${cleanedText}`);
                    setDetectedVin(cleanedText);
                    setItem('detectedVin', cleanedText);
                    return;
                } else if (validatePartialVIN(cleanedText)) {
                    detectedVIN = cleanedText;
                }
            }
        }

        if (detectedVIN) {
            const partialVIN = detectedVIN.slice(-6);
            console.log(`Detected partial VIN: ${partialVIN}`);
            setDetectedVin(partialVIN);
            setItem('detectedVin', partialVIN);
        } else {
            console.log('No valid VIN found in the image.');
        }
    } catch (error) {
        console.error('Failed to recognize text in image:', error);
    }
};

export const recognizeTextInImage = async (imageUri: string) => {
    try {
        const result = await TextRecognition.recognize(imageUri);
        console.log('Recognized text:', result.text);

        for (const block of result.blocks) {
            console.log('Block text:', block.text);
            console.log('Block frame:', block.frame);

            for (const line of block.lines) {
                console.log('Line text:', line.text);
                console.log('Line frame:', line.frame);
            }
        }
    } catch (error) {
        console.error('Failed to recognize text in image:', error);
    }
};