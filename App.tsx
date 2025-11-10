import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppState, TattooArtist } from './types';
import {
  getTattooIdeas,
  generateTattoo,
  editTattoo,
  findTattooArtists,
} from './services/geminiService';
import { getErrorMessage } from './utils/networkUtils';
import { responsiveSize } from './utils/responsive';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import RecommendationList from './components/RecommendationList';
import CustomInput from './components/CustomInput';
import ImagePreview from './components/ImagePreview';
import EditControls from './components/EditControls';
import ArtistFinder from './components/ArtistFinder';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.START);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [artists, setArtists] = useState<TattooArtist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (base64Image: string) => {
    setIsLoading(true);
    setLoadingMessage('Analyzing your canvas...');
    setError(null);
    try {
      setOriginalImage(base64Image);
      const ideas = await getTattooIdeas(base64Image);
      setRecommendations(ideas);
      setAppState(AppState.RECOMMEND);
    } catch (err) {
      setError(getErrorMessage(err) || 'Could not analyze the image. Please try another one.');
      console.error(err);
      setAppState(AppState.START);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationSelect = async (idea: string) => {
    if (!originalImage) return;
    setIsLoading(true);
    setLoadingMessage('Inking your design...');
    setError(null);
    setSelectedStyle(idea);
    try {
      const image = await generateTattoo(originalImage, `A tattoo of ${idea}.`);
      setGeneratedImage(image);
      setAppState(AppState.PREVIEW);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to generate the tattoo preview. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomIdeaClick = () => {
    if (!originalImage) return;
    setAppState(AppState.CUSTOM_INPUT);
  };

  const handleCustomGenerate = async (prompt: string, referenceImage?: string) => {
    if (!originalImage) return;
    setIsLoading(true);
    setLoadingMessage('Inking your design...');
    setError(null);
    setSelectedStyle(prompt);
    try {
      const image = await generateTattoo(originalImage, prompt, referenceImage);
      setGeneratedImage(image);
      setAppState(AppState.PREVIEW);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to generate the tattoo preview. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRequest = async (prompt: string) => {
    if (!generatedImage) return;
    setIsLoading(true);
    setLoadingMessage('Refining the ink...');
    setError(null);
    try {
      const image = await editTattoo(generatedImage, prompt);
      setGeneratedImage(image);
    } catch (err) {
      setError(getErrorMessage(err) || 'Could not apply the edit. Please try a different prompt.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindArtists = async () => {
    setIsLoading(true);
    setLoadingMessage('Scanning for local artists...');
    setError(null);
    setAppState(AppState.ARTISTS);
    try {
      const artistsResults = await findTattooArtists(selectedStyle);
      setArtists(artistsResults);
    } catch (err) {
      setError(
        getErrorMessage(err) ||
          'Could not find artists. Please check your location settings and try again.'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAppState(AppState.START);
    setOriginalImage(null);
    setGeneratedImage(null);
    setRecommendations([]);
    setSelectedStyle('');
    setArtists([]);
    setError(null);
  };

  const handleRetryLastAction = () => {
    setError(null);
    if (appState === AppState.RECOMMEND && originalImage) {
      handleImageUpload(originalImage);
    } else if (appState === AppState.CUSTOM_INPUT) {
      setAppState(AppState.CUSTOM_INPUT);
    } else if (appState === AppState.PREVIEW && originalImage && selectedStyle) {
      handleRecommendationSelect(selectedStyle);
    } else if (appState === AppState.ARTISTS && selectedStyle) {
      handleFindArtists();
    } else {
      handleReset();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message={loadingMessage} />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={handleRetryLastAction} />;
    }
    switch (appState) {
      case AppState.START:
        return <ImageUploader onImageUpload={handleImageUpload} />;
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
              <RecommendationList
                recommendations={recommendations}
                onSelect={handleRecommendationSelect}
                onCustomIdea={handleCustomIdeaClick}
              />
            </View>
          </ScrollView>
        );
      case AppState.CUSTOM_INPUT:
        return (
          originalImage && (
            <CustomInput
              bodyPartImage={originalImage}
              onGenerate={handleCustomGenerate}
              onBack={() => setAppState(AppState.RECOMMEND)}
            />
          )
        );
      case AppState.PREVIEW:
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.previewContainer}>
              {generatedImage && <ImagePreview image={generatedImage} />}
              <EditControls onEdit={handleEditRequest} onFindArtists={handleFindArtists} />
            </View>
          </ScrollView>
        );
      case AppState.ARTISTS:
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ArtistFinder
              artists={artists}
              onBack={() => setAppState(AppState.PREVIEW)}
              tattooStyle={selectedStyle}
            />
          </ScrollView>
        );
      default:
        return <ImageUploader onImageUpload={handleImageUpload} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.innerContainer}>
        {appState !== AppState.START && appState !== AppState.CUSTOM_INPUT && (
          <Header onReset={handleReset} />
        )}
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

export default App;
