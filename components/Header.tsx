import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { triggerHaptic } from '../utils/haptics';
import { throttle } from '../utils/debounce';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const fontFamily = {
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

interface HeaderProps {
  onReset?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const handleReset = throttle(() => {
    triggerHaptic('medium');
    if (onReset) {
      onReset();
    }
  }, 500);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        MONARCH TATTOO
      </Text>
      {onReset && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.8}
          accessibilityLabel="Start over"
          accessibilityHint="Resets the app and returns to the home screen"
          accessibilityRole="button"
        >
          <Text style={styles.resetButtonText}>START OVER</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Math.min(16, SCREEN_WIDTH * 0.04),
    paddingHorizontal: Math.min(8, SCREEN_WIDTH * 0.02),
  },
  title: {
    fontSize: Math.min(26, SCREEN_WIDTH * 0.065),
    fontWeight: '900',
    fontFamily: fontFamily.display,
    color: '#0f172a',
    flex: 1,
    flexShrink: 1,
    letterSpacing: 1.5,
  },
  resetButton: {
    backgroundColor: '#fef08a',
    paddingHorizontal: Math.min(12, SCREEN_WIDTH * 0.03),
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    marginLeft: 8,
  },
  resetButtonText: {
    fontSize: Math.min(11, SCREEN_WIDTH * 0.028),
    fontWeight: '800',
    fontFamily: fontFamily.bold,
    color: '#0f172a',
    letterSpacing: 1,
  },
});

export default Header;
