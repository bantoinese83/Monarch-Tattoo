import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { createImagePickerHandlers } from '../utils/imagePicker';
import { responsiveSize, fontFamily } from '../utils/responsive';
import { triggerHaptic } from '../utils/haptics';
import { useAppContext } from '../contexts/AppContext';
import { AppState } from '../types';
import Icon from './Icon';

const CustomInput: React.FC = () => {
  const { originalImage, handleCustomGenerate, setAppState } = useAppContext();
  const [customIdea, setCustomIdea] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const { handlePickImage: handlePickReferenceImage, handleTakePhoto: handleTakeReferencePhoto } =
    createImagePickerHandlers((base64) => setReferenceImage(base64), 'Failed to pick image');

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
    handleCustomGenerate(customIdea.trim(), referenceImage || undefined);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setAppState(AppState.RECOMMEND)}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Custom Tattoo Idea</Text>
        </View>

        {originalImage && (
          <View style={styles.bodyPartContainer}>
            <Text style={styles.sectionLabel}>Body Part</Text>
            <Image
              source={{ uri: `data:image/jpeg;base64,${originalImage}` }}
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
    paddingHorizontal: responsiveSize(16, 0.04),
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
    fontSize: responsiveSize(28, 0.07),
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
    fontSize: responsiveSize(18, 0.045),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
    marginBottom: 12,
  },
  sectionSubtext: {
    fontSize: responsiveSize(13, 0.032),
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
    fontSize: responsiveSize(16, 0.04),
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
    fontSize: responsiveSize(16, 0.04),
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
    fontSize: responsiveSize(18, 0.045),
    fontWeight: 'bold',
    fontFamily: fontFamily.bold,
    color: '#000',
  },
});

export default CustomInput;
