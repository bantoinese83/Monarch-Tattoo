import { Alert } from 'react-native';
import { pickImage, takePhoto } from './fileUtils';
import { triggerHaptic } from './haptics';
import { throttle } from './debounce';

export const createImagePickerHandlers = (
  onImageSelected: (base64: string) => void,
  errorMessage: string = 'Failed to pick image'
) => {
  const handlePickImage = throttle(async () => {
    triggerHaptic('light');
    try {
      const base64 = await pickImage();
      if (base64) {
        triggerHaptic('success');
        onImageSelected(base64);
      }
    } catch (error) {
      triggerHaptic('error');
      const message = error instanceof Error ? error.message : errorMessage;
      Alert.alert('Error', message);
    }
  }, 500);

  const handleTakePhoto = throttle(async () => {
    triggerHaptic('light');
    try {
      const base64 = await takePhoto();
      if (base64) {
        triggerHaptic('success');
        onImageSelected(base64);
      }
    } catch (error) {
      triggerHaptic('error');
      const message = error instanceof Error ? error.message : errorMessage;
      Alert.alert('Error', message);
    }
  }, 500);

  return { handlePickImage, handleTakePhoto };
};
