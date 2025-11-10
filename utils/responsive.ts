import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

export const responsiveSize = (size: number, scale: number = 0.04): number => {
  return Math.min(size, SCREEN_WIDTH * scale);
};

export const fontFamily = {
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
  display: Platform.select({
    ios: 'System',
    android: 'Roboto-Black',
    default: 'System',
  }),
};

