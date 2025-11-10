import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { pickImage, takePhoto } from '../utils/fileUtils';
import { triggerHaptic } from '../utils/haptics';
import { throttle } from '../utils/debounce';
import Icon from './Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Modern font stack - SF Pro on iOS, Roboto on Android
const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  display: Platform.select({
    ios: 'System',
    android: 'Roboto-Black',
    default: 'System',
  }),
};

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handlePickImage = throttle(async () => {
    triggerHaptic('light');
    try {
      const base64 = await pickImage();
      if (base64) {
        triggerHaptic('success');
        onImageUpload(base64);
      }
    } catch (error) {
      triggerHaptic('error');
      const message = error instanceof Error ? error.message : 'Failed to pick image';
      Alert.alert('Error', message);
    }
  }, 500);

  const handleTakePhoto = throttle(async () => {
    triggerHaptic('light');
    try {
      const base64 = await takePhoto();
      if (base64) {
        triggerHaptic('success');
        onImageUpload(base64);
      }
    } catch (error) {
      triggerHaptic('error');
      const message = error instanceof Error ? error.message : 'Failed to take photo';
      Alert.alert('Error', message);
    }
  }, 500);

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>Monarch Tattoo</Text>
          <Text style={styles.tagline}>
            Visualize your tattoo design before you ink. Get personalized style recommendations and
            preview your perfect tattoo.
          </Text>
        </View>

        <View style={styles.uploadSection}>
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={handlePickImage}
            activeOpacity={0.8}
            accessibilityLabel="Select image from gallery"
            accessibilityHint="Opens your photo gallery to choose a body part image"
            accessibilityRole="button"
          >
            <View style={styles.uploadIconContainer}>
              <Icon name="image" size={Math.min(48, SCREEN_WIDTH * 0.12)} color="#000" />
            </View>
            <Text style={styles.uploadText}>Select from Gallery</Text>
            <Text style={styles.uploadSubtext}>
              Choose a clear photo of the body part you want to ink
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleTakePhoto}
            activeOpacity={0.8}
            accessibilityLabel="Take a photo"
            accessibilityHint="Opens camera to take a photo of the body part"
            accessibilityRole="button"
          >
            <Icon name="camera" size={Math.min(20, SCREEN_WIDTH * 0.05)} color="#000" />
            <Text style={styles.cameraButtonText}>Take a Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Icon name="sparkles" size={Math.min(24, SCREEN_WIDTH * 0.06)} color="#000" />
            </View>
            <Text style={styles.featureText}>Style Recommendations</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Icon name="palette" size={Math.min(24, SCREEN_WIDTH * 0.06)} color="#000" />
            </View>
            <Text style={styles.featureText}>Realistic Previews</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Icon name="map-pin" size={Math.min(24, SCREEN_WIDTH * 0.06)} color="#000" />
            </View>
            <Text style={styles.featureText}>Find Local Artists</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Math.min(24, SCREEN_WIDTH * 0.06),
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  headerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Math.min(40, SCREEN_WIDTH * 0.1),
  },
  welcomeText: {
    fontSize: Math.min(15, SCREEN_WIDTH * 0.038),
    color: '#000',
    fontFamily: fontFamily.medium,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  appName: {
    fontSize: Math.min(48, SCREEN_WIDTH * 0.12),
    fontWeight: '900',
    fontFamily: fontFamily.display,
    color: '#000',
    marginBottom: Math.min(20, SCREEN_WIDTH * 0.05),
    textAlign: 'center',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: Math.min(15, SCREEN_WIDTH * 0.038),
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Math.min(20, SCREEN_WIDTH * 0.05),
    fontFamily: fontFamily.regular,
    fontWeight: '600',
  },
  uploadSection: {
    width: '100%',
    marginBottom: Math.min(32, SCREEN_WIDTH * 0.08),
  },
  uploadArea: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderStyle: 'dashed',
    borderColor: '#000',
    borderRadius: 0,
    padding: Math.min(32, SCREEN_WIDTH * 0.08),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Math.min(160, SCREEN_WIDTH * 0.4),
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  uploadIconContainer: {
    marginBottom: Math.min(12, SCREEN_WIDTH * 0.03),
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  uploadSubtext: {
    fontSize: Math.min(13, SCREEN_WIDTH * 0.032),
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Math.min(20, SCREEN_WIDTH * 0.05),
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 2,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#000',
  },
  orText: {
    fontSize: Math.min(13, SCREEN_WIDTH * 0.033),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
    marginHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  cameraButton: {
    width: '100%',
    backgroundColor: '#f472b6',
    paddingVertical: Math.min(16, SCREEN_WIDTH * 0.04),
    paddingHorizontal: 24,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cameraButtonText: {
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
    letterSpacing: 0.5,
  },
  featuresSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: Math.min(16, SCREEN_WIDTH * 0.04),
  },
  feature: {
    alignItems: 'center',
    minWidth: Math.min(100, SCREEN_WIDTH * 0.25),
  },
  featureIconContainer: {
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: Math.min(12, SCREEN_WIDTH * 0.03),
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: fontFamily.medium,
    letterSpacing: 0.3,
  },
});

export default ImageUploader;
