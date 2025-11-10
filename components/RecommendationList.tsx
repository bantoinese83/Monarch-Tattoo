import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { triggerHaptic } from '../utils/haptics';
import { throttle } from '../utils/debounce';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RecommendationListProps {
  recommendations: string[];
  onSelect: (recommendation: string) => void;
  onCustomIdea: () => void;
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  onSelect,
  onCustomIdea,
}) => {
  const handleSelect = throttle((rec: string): void => {
    triggerHaptic('medium');
    onSelect(rec);
  }, 500);

  const handleCustomIdea = throttle((): void => {
    triggerHaptic('medium');
    onCustomIdea();
  }, 500);

  return (
    <View style={styles.container} accessibilityRole="list">
      {recommendations.length > 0 && (
        <>
          {recommendations.map((rec, index) => (
            <TouchableOpacity
              key={`${rec}-${index}`}
              style={styles.button}
              onPress={() => handleSelect(rec)}
              activeOpacity={0.8}
              accessibilityLabel={`Select ${rec} tattoo style`}
              accessibilityHint="Generates a tattoo preview with this style"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>{rec}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
        </>
      )}
      <TouchableOpacity
        style={styles.customButton}
        onPress={handleCustomIdea}
        activeOpacity={0.8}
        accessibilityLabel="Create custom tattoo idea"
        accessibilityHint="Opens custom input to describe your own tattoo design"
        accessibilityRole="button"
      >
        <Text style={styles.customButtonText}>Create Custom Idea</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: '#fff',
    padding: Math.min(18, SCREEN_WIDTH * 0.045),
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonText: {
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
    color: '#71717a',
    textAlign: 'center',
    padding: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
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
    color: '#000',
    marginHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  customButton: {
    backgroundColor: '#f472b6',
    padding: Math.min(18, SCREEN_WIDTH * 0.045),
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  customButtonText: {
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});

export default RecommendationList;
