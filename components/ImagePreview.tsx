import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { triggerHaptic } from '../utils/haptics';
import Icon from './Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImagePreviewProps {
  image: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => {
    triggerHaptic('light');
    setIsZoomed(!isZoomed);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={toggleZoom}
        activeOpacity={0.9}
        accessibilityLabel="Tattoo preview"
        accessibilityHint="Tap to zoom in on the tattoo design"
        accessibilityRole="imagebutton"
      >
        <Image
          source={{ uri: `data:image/jpeg;base64,${image}` }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="Generated tattoo design preview"
        />
      </TouchableOpacity>

      <Modal visible={isZoomed} transparent={true} animationType="fade" onRequestClose={toggleZoom}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleZoom}
            activeOpacity={0.8}
            accessibilityLabel="Close zoom"
            accessibilityRole="button"
          >
            <Icon name="x" size={24} color="#fff" />
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            maximumZoomScale={3}
            minimumZoomScale={1}
            bouncesZoom={true}
            scrollEnabled={true}
            pinchGestureEnabled={true}
            accessibilityLabel="Zoomed tattoo preview"
          >
            <Image
              source={{ uri: `data:image/jpeg;base64,${image}` }}
              style={styles.zoomedImage}
              resizeMode="contain"
              accessibilityLabel="Zoomed tattoo design"
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: Math.min(14, SCREEN_WIDTH * 0.035),
    borderWidth: 4,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    marginBottom: 20,
    width: '100%',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    ...(Platform.OS === 'ios' && {
      // iOS specific optimizations
      resizeMode: 'contain',
    }),
  },
});

export default ImagePreview;
