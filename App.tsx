import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppState } from './types';
import { responsiveSize } from './utils/responsive';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import RecommendationList from './components/RecommendationList';
import CustomInput from './components/CustomInput';
import ImagePreview from './components/ImagePreview';
import EditControls from './components/EditControls';
import ArtistFinder from './components/ArtistFinder';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const AppContent: React.FC = () => {
  const { appState, originalImage, generatedImage, isLoading, loadingMessage, error } =
    useAppContext();

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message={loadingMessage} />;
    }
    if (error) {
      return <ErrorDisplay />;
    }
    switch (appState) {
      case AppState.START:
        return <ImageUploader />;
      case AppState.RECOMMEND:
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.recommendContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} accessibilityRole="header">
                  Choose Your Style
                </Text>
              </View>
              {originalImage && (
                <View style={styles.imageContainer} accessibilityLabel="Uploaded body part image">
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${originalImage}` }}
                    style={styles.originalImage}
                    resizeMode="contain"
                    accessibilityLabel="Body part image for tattoo placement"
                  />
                </View>
              )}
              <RecommendationList />
            </View>
          </ScrollView>
        );
      case AppState.CUSTOM_INPUT:
        return originalImage ? <CustomInput /> : null;
      case AppState.PREVIEW:
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.previewContainer}>
              {generatedImage && <ImagePreview image={generatedImage} />}
              <EditControls />
            </View>
          </ScrollView>
        );
      case AppState.ARTISTS:
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ArtistFinder />
          </ScrollView>
        );
      default:
        return <ImageUploader />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.innerContainer}>
        {appState !== AppState.START && appState !== AppState.CUSTOM_INPUT && <Header />}
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f472b6',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: responsiveSize(16, 0.04),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveSize(16, 0.04),
    paddingBottom: 20,
    paddingTop: 8,
  },
  recommendContainer: {
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: responsiveSize(28, 0.07),
    fontWeight: 'bold',
    color: '#18181b',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  originalImage: {
    width: '100%',
    aspectRatio: 1,
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
