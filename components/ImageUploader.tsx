import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createImagePickerHandlers } from '../utils/imagePicker';
import { responsiveSize, screen, fontFamily } from '../utils/responsive';
import Icon from './Icon';

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const { handlePickImage, handleTakePhoto } = createImagePickerHandlers(
    onImageUpload,
    'Failed to pick image'
  );

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
              <Icon name="image" size={responsiveSize(48, 0.12)} color="#000" />
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
            <Icon name="camera" size={responsiveSize(20, 0.05)} color="#000" />
            <Text style={styles.cameraButtonText}>Take a Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Icon name="sparkles" size={responsiveSize(24, 0.06)} color="#000" />
            </View>
            <Text style={styles.featureText}>Style Recommendations</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Icon name="palette" size={responsiveSize(24, 0.06)} color="#000" />
            </View>
            <Text style={styles.featureText}>Realistic Previews</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Icon name="map-pin" size={responsiveSize(24, 0.06)} color="#000" />
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
    paddingHorizontal: responsiveSize(24, 0.06),
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  headerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: responsiveSize(40, 0.1),
  },
  welcomeText: {
    fontSize: responsiveSize(15, 0.038),
    color: '#000',
    fontFamily: fontFamily.medium,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  appName: {
    fontSize: responsiveSize(48, 0.12),
    fontWeight: '900',
    fontFamily: fontFamily.display,
    color: '#000',
    marginBottom: responsiveSize(20, 0.05),
    textAlign: 'center',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: responsiveSize(15, 0.038),
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: responsiveSize(20, 0.05),
    fontFamily: fontFamily.regular,
    fontWeight: '600',
  },
  uploadSection: {
    width: '100%',
    marginBottom: responsiveSize(32, 0.08),
  },
  uploadArea: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderStyle: 'dashed',
    borderColor: '#000',
    borderRadius: 0,
    padding: responsiveSize(32, 0.08),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: responsiveSize(160, 0.4),
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  uploadIconContainer: {
    marginBottom: responsiveSize(12, 0.03),
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: responsiveSize(18, 0.045),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  uploadSubtext: {
    fontSize: responsiveSize(13, 0.032),
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsiveSize(20, 0.05),
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
    fontSize: responsiveSize(13, 0.033),
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
    paddingVertical: responsiveSize(16, 0.04),
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
    fontSize: responsiveSize(18, 0.045),
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
    gap: responsiveSize(16, 0.04),
  },
  feature: {
    alignItems: 'center',
    minWidth: responsiveSize(100, 0.25),
  },
  featureIconContainer: {
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: responsiveSize(12, 0.03),
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: fontFamily.medium,
    letterSpacing: 0.3,
  },
});

export default ImageUploader;
