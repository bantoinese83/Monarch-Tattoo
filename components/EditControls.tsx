import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { triggerHaptic } from '../utils/haptics';
import { throttle } from '../utils/debounce';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EditControlsProps {
  onEdit: (prompt: string) => void;
  onFindArtists: () => void;
}

const EditControls: React.FC<EditControlsProps> = ({ onEdit, onFindArtists }) => {
  const [prompt, setPrompt] = useState('');

  const validatePrompt = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length < 3) {
      return false;
    }
    if (trimmed.length > 200) {
      return false;
    }
    return true;
  };

  const handleSubmit = throttle(() => {
    const trimmedPrompt = prompt.trim();
    if (!validatePrompt(trimmedPrompt)) {
      triggerHaptic('warning');
      return;
    }
    triggerHaptic('medium');
    onEdit(trimmedPrompt);
    setPrompt('');
    Keyboard.dismiss();
  }, 500);

  const handleFindArtists = throttle(() => {
    triggerHaptic('medium');
    onFindArtists();
  }, 500);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="e.g., 'Add a retro filter' or 'Make it smaller'"
            placeholderTextColor="#71717a"
            onSubmitEditing={handleSubmit}
            maxLength={200}
            accessibilityLabel="Edit prompt input"
            accessibilityHint="Enter your edit request. Must be between 3 and 200 characters."
            returnKeyType="done"
            blurOnSubmit={true}
          />
          <TouchableOpacity
            style={[styles.editButton, !validatePrompt(prompt.trim()) && styles.editButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            accessibilityLabel="Apply edit"
            accessibilityHint="Applies your edit request to the tattoo design"
            accessibilityRole="button"
            disabled={!validatePrompt(prompt.trim())}
          >
            <Text
              style={[
                styles.editButtonText,
                !validatePrompt(prompt.trim()) && styles.editButtonTextDisabled,
              ]}
            >
              EDIT
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.artistSection}>
          <Text style={styles.artistQuestion}>HAPPY WITH THE DESIGN?</Text>
          <TouchableOpacity
            style={styles.artistButton}
            onPress={handleFindArtists}
            activeOpacity={0.8}
            accessibilityLabel="Find tattoo artist"
            accessibilityHint="Searches for local tattoo artists specializing in this style"
            accessibilityRole="button"
          >
            <Text style={styles.artistButtonText}>FIND AN ARTIST</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f4f4f5',
    padding: Math.min(14, SCREEN_WIDTH * 0.035),
    borderWidth: 4,
    borderColor: '#000',
  },
  form: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 2,
    borderColor: '#000',
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
    backgroundColor: '#fff',
  },
  editButton: {
    backgroundColor: '#fef08a',
    paddingHorizontal: Math.min(20, SCREEN_WIDTH * 0.05),
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#71717a',
    marginVertical: 12,
  },
  artistSection: {
    alignItems: 'center',
  },
  artistQuestion: {
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  artistButton: {
    width: '100%',
    backgroundColor: '#bef264',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  artistButtonText: {
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    fontWeight: 'bold',
    color: '#000',
  },
  editButtonDisabled: {
    opacity: 0.5,
  },
  editButtonTextDisabled: {
    opacity: 0.7,
  },
});

export default EditControls;
