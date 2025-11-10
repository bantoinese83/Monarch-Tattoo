import * as ImagePicker from 'expo-image-picker';

const optimizeImage = async (base64: string): Promise<string> => {
  // For now, return as-is. In production, you might want to use
  // a library like react-native-image-resizer for better compression
  return base64;
};

export const pickImage = async (): Promise<string | null> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
      base64: true,
      aspect: [1, 1],
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]) {
      const base64 = result.assets[0].base64;
      if (!base64) {
        throw new Error('Failed to get image data');
      }
      return await optimizeImage(base64);
    }
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
};

export const takePhoto = async (): Promise<string | null> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access camera was denied');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.85,
      base64: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const base64 = result.assets[0].base64;
      if (!base64) {
        throw new Error('Failed to get image data');
      }
      return await optimizeImage(base64);
    }
    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    throw error;
  }
};
