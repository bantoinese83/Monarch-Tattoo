import React from 'react';
import { ViewStyle } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { responsiveSize } from '../utils/responsive';

export type IconName =
  | 'image'
  | 'camera'
  | 'sparkles'
  | 'palette'
  | 'map-pin'
  | 'upload'
  | 'edit'
  | 'search'
  | 'check'
  | 'x'
  | 'arrow-left'
  | 'arrow-right'
  | 'star'
  | 'heart'
  | 'settings'
  | 'user'
  | 'home'
  | 'menu'
  | 'more-vertical'
  | 'trash'
  | 'download'
  | 'share'
  | 'info'
  | 'alert-circle'
  | 'check-circle';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const iconMap: Record<IconName, keyof typeof LucideIcons> = {
  image: 'Image',
  camera: 'Camera',
  sparkles: 'Sparkles',
  palette: 'Palette',
  'map-pin': 'MapPin',
  upload: 'Upload',
  edit: 'Edit',
  search: 'Search',
  check: 'Check',
  x: 'X',
  'arrow-left': 'ArrowLeft',
  'arrow-right': 'ArrowRight',
  star: 'Star',
  heart: 'Heart',
  settings: 'Settings',
  user: 'User',
  home: 'Home',
  menu: 'Menu',
  'more-vertical': 'MoreVertical',
  trash: 'Trash2',
  download: 'Download',
  share: 'Share2',
  info: 'Info',
  'alert-circle': 'AlertCircle',
  'check-circle': 'CheckCircle',
};

const Icon: React.FC<IconProps> = ({ name, size, color = '#18181b', style }) => {
  const IconComponent = LucideIcons[iconMap[name]] as React.ComponentType<{
    size?: number;
    color?: string;
    style?: ViewStyle;
  }>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const iconSize = size || responsiveSize(24, 0.06);

  return <IconComponent size={iconSize} color={color} style={style} />;
};

export default Icon;
