import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { pickImage, takePhoto } from '../utils/fileUtils';
import { triggerHaptic } from '../utils/haptics';
import { throttle } from '../utils/debounce';
import Icon from './Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
};

interface CustomInputProps {
  bodyPartImage: string;
  onGenerate: (prompt: string, referenceImage?: string) => void;
  onBack: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ bodyPartImage, onGenerate, onBack }) => {
  const [customIdea, setCustomIdea] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const handlePickReferenceImage = throttle(async () => {
    triggerHaptic('light');
    try {
      const base64 = await pickImage();
      if (base64) {
        triggerHaptic('success');
        setReferenceImage(base64);
      }
    } catch (error) {
      triggerHaptic('error');
      const message = error instanceof Error ? error.message : 'Failed to pick image';
      Alert.alert('Error', message);
    }
  }, 500);

  const handleTakeReferencePhoto = throttle(async () => {
    triggerHaptic('light');
    try {
      const base64 = await takePhoto();
      if (base64) {
        triggerHaptic('success');
        setReferenceImage(base64);
      }
    } catch (error) {
      triggerHaptic('error');
      const message = error instanceof Error ? error.message : 'Failed to take photo';
      Alert.alert('Error', message);
    }
  }, 500);

  const handleRemoveReference = () => {
    triggerHaptic('light');
    setReferenceImage(null);
  };

  const handleGenerate = () => {
    if (!customIdea.trim()) {
      Alert.alert('Required', 'Please enter your tattoo idea');
      return;
    }
    triggerHaptic('medium');
    onGenerate(customIdea.trim(), referenceImage || undefined);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Custom Tattoo Idea</Text>
        </View>

        {bodyPartImage && (
          <View style={styles.bodyPartContainer}>
            <Text style={styles.sectionLabel}>Body Part</Text>
            <Image
              source={{ uri: `data:image/jpeg;base64,${bodyPartImage}` }}
              style={styles.bodyPartImage}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Describe Your Tattoo Idea</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., A neo-traditional tiger with geometric patterns"
            placeholderTextColor="#71717a"
            value={customIdea}
            onChangeText={setCustomIdea}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel="Tattoo idea description"
            accessibilityHint="Enter a description of your custom tattoo design"
          />
        </View>

        <View style={styles.referenceSection}>
          <Text style={styles.sectionLabel}>Reference Image (Optional)</Text>
          <Text style={styles.sectionSubtext}>
            Upload an image for style guidance or inspiration
          </Text>

          {referenceImage ? (
            <View style={styles.referenceImageContainer}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${referenceImage}` }}
                style={styles.referenceImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveReference}
                accessibilityLabel="Remove reference image"
              >
                <Icon name="x" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.referenceButtons}>
              <TouchableOpacity
                style={styles.referenceButton}
                onPress={handlePickReferenceImage}
                activeOpacity={0.8}
                accessibilityLabel="Select reference image from gallery"
              >
                <Icon name="image" size={20} color="#000" />
                <Text style={styles.referenceButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.referenceButton}
                onPress={handleTakeReferencePhoto}
                activeOpacity={0.8}
                accessibilityLabel="Take reference photo"
              >
                <Icon name="camera" size={20} color="#000" />
                <Text style={styles.referenceButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.generateButton, !customIdea.trim() && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={!customIdea.trim()}
          activeOpacity={0.8}
          accessibilityLabel="Generate tattoo"
          accessibilityRole="button"
        >
          <Text style={styles.generateButtonText}>Generate Tattoo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: Math.min(16, SCREEN_WIDTH * 0.04),
    paddingBottom: 20,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: Math.min(28, SCREEN_WIDTH * 0.07),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
  },
  bodyPartContainer: {
    marginBottom: 24,
  },
  bodyPartImage: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  sectionLabel: {
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
    marginBottom: 12,
  },
  sectionSubtext: {
    fontSize: Math.min(13, SCREEN_WIDTH * 0.032),
    color: '#71717a',
    marginBottom: 12,
    fontFamily: fontFamily.regular,
  },
  inputSection: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 8,
    padding: 16,
    fontSize: Math.min(16, SCREEN_WIDTH * 0.04),
    fontFamily: fontFamily.regular,
    color: '#000',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  referenceSection: {
    marginBottom: 32,
  },
  referenceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  referenceButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 8,
    padding: 16,
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
  referenceButtonText: {
    fontSize: Math.min(16, SCREEN_WIDTH * 0.04),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
  },
  referenceImageContainer: {
    position: 'relative',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  referenceImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fff',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButton: {
    backgroundColor: '#f472b6',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
  },
});

export default CustomInput;

