import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { triggerHaptic } from '../utils/haptics';
import { throttle } from '../utils/debounce';
import { useAppContext } from '../contexts/AppContext';
import { responsiveSize, fontFamily } from '../utils/responsive';

const Header: React.FC = () => {
  const { handleReset } = useAppContext();
  const handleResetClick = throttle(() => {
    triggerHaptic('medium');
    handleReset();
  }, 500);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        MONARCH TATTOO
      </Text>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetClick}
        activeOpacity={0.8}
        accessibilityLabel="Start over"
        accessibilityHint="Resets the app and returns to the home screen"
        accessibilityRole="button"
      >
        <Text style={styles.resetButtonText}>START OVER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSize(16, 0.04),
    paddingHorizontal: responsiveSize(8, 0.02),
  },
  title: {
    fontSize: responsiveSize(26, 0.065),
    fontWeight: '900',
    fontFamily: fontFamily.display,
    color: '#0f172a',
    flex: 1,
    flexShrink: 1,
    letterSpacing: 1.5,
  },
  resetButton: {
    backgroundColor: '#fef08a',
    paddingHorizontal: responsiveSize(12, 0.03),
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
    fontSize: responsiveSize(11, 0.028),
    fontWeight: '800',
    fontFamily: fontFamily.bold,
    color: '#0f172a',
    letterSpacing: 1,
  },
});

export default Header;
