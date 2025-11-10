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
    const responsiveStyle: any = { ...style };
    
    if (style.fontSize && typeof style.fontSize === 'number') {
      responsiveStyle.fontSize = responsiveSize(style.fontSize, 0.04);
    }
    if (style.padding && typeof style.padding === 'number') {
      responsiveStyle.padding = responsiveSize(style.padding, 0.04);
    }
    if (style.paddingHorizontal && typeof style.paddingHorizontal === 'number') {
      responsiveStyle.paddingHorizontal = responsiveSize(style.paddingHorizontal, 0.04);
    }
    if (style.paddingVertical && typeof style.paddingVertical === 'number') {
      responsiveStyle.paddingVertical = responsiveSize(style.paddingVertical, 0.04);
    }
    if (style.margin && typeof style.margin === 'number') {
      responsiveStyle.margin = responsiveSize(style.margin, 0.04);
    }
    if (style.marginBottom && typeof style.marginBottom === 'number') {
      responsiveStyle.marginBottom = responsiveSize(style.marginBottom, 0.04);
    }
    if (style.marginTop && typeof style.marginTop === 'number') {
      responsiveStyle.marginTop = responsiveSize(style.marginTop, 0.04);
    }
    if (style.marginHorizontal && typeof style.marginHorizontal === 'number') {
      responsiveStyle.marginHorizontal = responsiveSize(style.marginHorizontal, 0.04);
    }
    if (style.marginVertical && typeof style.marginVertical === 'number') {
      responsiveStyle.marginVertical = responsiveSize(style.marginVertical, 0.04);
    }
    if (style.gap && typeof style.gap === 'number') {
      responsiveStyle.gap = responsiveSize(style.gap, 0.04);
    }
    if (style.minHeight && typeof style.minHeight === 'number') {
      responsiveStyle.minHeight = responsiveSize(style.minHeight, 0.04);
    }
    if (style.minWidth && typeof style.minWidth === 'number') {
      responsiveStyle.minWidth = responsiveSize(style.minWidth, 0.04);
    }
    
    acc[key] = responsiveStyle;
    return acc;
  }, {} as T);
};

