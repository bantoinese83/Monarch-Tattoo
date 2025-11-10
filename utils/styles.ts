import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { responsiveSize } from './responsive';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#f472b6',
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#fef08a',
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  text: {
    color: '#000',
  },
  secondaryText: {
    color: '#71717a',
  },
});

export const createResponsiveStyle = <T extends Record<string, ViewStyle | TextStyle>>(
  styles: T
): T => {
  return Object.entries(styles).reduce((acc, [key, style]) => {
    const responsiveStyle: ViewStyle | TextStyle = { ...style };

    if ('fontSize' in responsiveStyle && typeof responsiveStyle.fontSize === 'number') {
      (responsiveStyle as TextStyle).fontSize = responsiveSize(responsiveStyle.fontSize, 0.04);
    }
    if ('padding' in responsiveStyle && typeof responsiveStyle.padding === 'number') {
      responsiveStyle.padding = responsiveSize(responsiveStyle.padding, 0.04);
    }
    if (
      'paddingHorizontal' in responsiveStyle &&
      typeof responsiveStyle.paddingHorizontal === 'number'
    ) {
      responsiveStyle.paddingHorizontal = responsiveSize(responsiveStyle.paddingHorizontal, 0.04);
    }
    if (
      'paddingVertical' in responsiveStyle &&
      typeof responsiveStyle.paddingVertical === 'number'
    ) {
      responsiveStyle.paddingVertical = responsiveSize(responsiveStyle.paddingVertical, 0.04);
    }
    if ('margin' in responsiveStyle && typeof responsiveStyle.margin === 'number') {
      responsiveStyle.margin = responsiveSize(responsiveStyle.margin, 0.04);
    }
    if ('marginBottom' in responsiveStyle && typeof responsiveStyle.marginBottom === 'number') {
      responsiveStyle.marginBottom = responsiveSize(responsiveStyle.marginBottom, 0.04);
    }
    if ('marginTop' in responsiveStyle && typeof responsiveStyle.marginTop === 'number') {
      responsiveStyle.marginTop = responsiveSize(responsiveStyle.marginTop, 0.04);
    }
    if (
      'marginHorizontal' in responsiveStyle &&
      typeof responsiveStyle.marginHorizontal === 'number'
    ) {
      responsiveStyle.marginHorizontal = responsiveSize(responsiveStyle.marginHorizontal, 0.04);
    }
    if ('marginVertical' in responsiveStyle && typeof responsiveStyle.marginVertical === 'number') {
      responsiveStyle.marginVertical = responsiveSize(responsiveStyle.marginVertical, 0.04);
    }
    if ('gap' in responsiveStyle && typeof responsiveStyle.gap === 'number') {
      responsiveStyle.gap = responsiveSize(responsiveStyle.gap, 0.04);
    }
    if ('minHeight' in responsiveStyle && typeof responsiveStyle.minHeight === 'number') {
      responsiveStyle.minHeight = responsiveSize(responsiveStyle.minHeight, 0.04);
    }
    if ('minWidth' in responsiveStyle && typeof responsiveStyle.minWidth === 'number') {
      responsiveStyle.minWidth = responsiveSize(responsiveStyle.minWidth, 0.04);
    }

    (acc as Record<string, ViewStyle | TextStyle>)[key] = responsiveStyle;
    return acc;
  }, {} as T);
};
