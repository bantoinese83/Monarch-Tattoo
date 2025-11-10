import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
      <ActivityIndicator size="large" color="#000" accessibilityLabel="Loading" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Math.min(24, SCREEN_WIDTH * 0.06),
    backgroundColor: '#f4f4f5',
    borderWidth: 4,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    width: '100%',
  },
  message: {
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
