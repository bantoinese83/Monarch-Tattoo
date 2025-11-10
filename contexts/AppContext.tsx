import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, TattooArtist } from '../types';
import {
  getTattooIdeas,
  generateTattoo,
  editTattoo,
  findTattooArtists,
} from '../services/geminiService';
import { getErrorMessage } from '../utils/networkUtils';

interface AppContextType {
  // State
  appState: AppState;
  originalImage: string | null;
  generatedImage: string | null;
  recommendations: string[];
  selectedStyle: string;
  artists: TattooArtist[];
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;

  // Actions
  handleImageUpload: (base64Image: string) => Promise<void>;
  handleRecommendationSelect: (idea: string) => Promise<void>;
  handleCustomIdeaClick: () => void;
  handleCustomGenerate: (prompt: string, referenceImage?: string) => Promise<void>;
  handleEditRequest: (prompt: string) => Promise<void>;
  handleFindArtists: () => Promise<void>;
  handleReset: () => void;
  setAppState: (state: AppState) => void;
  handleRetryLastAction: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
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
    } else if (appState === AppState.CUSTOM_INPUT && originalImage) {
      setAppState(AppState.CUSTOM_INPUT);
    } else if (appState === AppState.PREVIEW && originalImage && selectedStyle) {
      handleRecommendationSelect(selectedStyle);
    } else if (appState === AppState.ARTISTS && selectedStyle) {
      handleFindArtists();
    } else {
      handleReset();
    }
  };

  const value: AppContextType = {
    appState,
    originalImage,
    generatedImage,
    recommendations,
    selectedStyle,
    artists,
    isLoading,
    loadingMessage,
    error,
    handleImageUpload,
    handleRecommendationSelect,
    handleCustomIdeaClick,
    handleCustomGenerate,
    handleEditRequest,
    handleFindArtists,
    handleReset,
    setAppState,
    handleRetryLastAction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
