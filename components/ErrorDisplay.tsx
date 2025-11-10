import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { triggerHaptic } from '../utils/haptics';
import { throttle } from '../utils/debounce';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  React.useEffect(() => {
    triggerHaptic('error');
  }, []);

  const handleRetry = throttle(() => {
    triggerHaptic('medium');
    onRetry();
  }, 500);

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.title} accessibilityRole="header">
        An Error Occurred
      </Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRetry}
        activeOpacity={0.8}
        accessibilityLabel="Try again"
        accessibilityHint="Retries the previous action"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>TRY AGAIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Math.min(24, SCREEN_WIDTH * 0.06),
    backgroundColor: '#ef4444',
    borderWidth: 4,
    borderColor: '#000',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: Math.min(20, SCREEN_WIDTH * 0.05),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  message: {
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: Math.min(24, SCREEN_WIDTH * 0.06),
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  buttonText: {
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
    fontWeight: 'bold',
    color: '#ef4444',
  },
});

export default ErrorDisplay;
