import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { triggerHaptic } from '../utils/haptics';
import { throttle } from '../utils/debounce';
import { TattooArtist } from '../types';

// Conditionally import MapView only if available (requires development build)
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

try {
  const mapsModule = require('expo-maps');
  MapView = mapsModule.MapView;
  Marker = mapsModule.Marker;
  PROVIDER_GOOGLE = mapsModule.PROVIDER_GOOGLE;
} catch (error) {
  console.warn('expo-maps not available, map view will be disabled');
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ArtistFinderProps {
  artists: TattooArtist[];
  onBack: () => void;
  tattooStyle: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.starContainer}>
      <Text style={styles.stars}>{'★'.repeat(fullStars)}</Text>
      {halfStar && <Text style={styles.stars}>½</Text>}
      <Text style={styles.stars}>{'☆'.repeat(emptyStars)}</Text>
    </View>
  );
};

const ArtistFinder: React.FC<ArtistFinderProps> = ({ artists, onBack, tattooStyle }) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [artistsWithCoords, setArtistsWithCoords] = useState<TattooArtist[]>([]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.warn('Failed to get user location:', error);
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    // Filter artists that have coordinates
    const withCoords = artists.filter((artist) => artist.latitude && artist.longitude);
    setArtistsWithCoords(withCoords);
    
    // If no artists have coordinates or MapView is not available, hide map
    if (withCoords.length === 0 || !MapView) {
      setShowMap(false);
    }
  }, [artists]);

  const handleOpenMap = throttle(async (uri: string): Promise<void> => {
    triggerHaptic('light');
    try {
      const canOpen = await Linking.canOpenURL(uri);
      if (canOpen) {
        await Linking.openURL(uri);
        triggerHaptic('success');
      } else {
        triggerHaptic('error');
        Alert.alert('Error', 'Cannot open map link');
      }
    } catch {
      triggerHaptic('error');
      Alert.alert('Error', 'Failed to open map');
    }
  }, 500);

  const handleBack = throttle(() => {
    triggerHaptic('light');
    onBack();
  }, 500);

  const toggleView = throttle(() => {
    triggerHaptic('light');
    setShowMap(!showMap);
  }, 500);

  // Calculate map region to show all markers
  const getMapRegion = () => {
    if (artistsWithCoords.length === 0 && userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    if (artistsWithCoords.length === 0) {
      return {
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    const latitudes = artistsWithCoords.map((a) => a.latitude!).filter(Boolean);
    const longitudes = artistsWithCoords.map((a) => a.longitude!).filter(Boolean);
    
    if (userLocation) {
      latitudes.push(userLocation.latitude);
      longitudes.push(userLocation.longitude);
    }

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = Math.max(maxLat - minLat, 0.01) * 1.5;
    const lngDelta = Math.max(maxLng - minLng, 0.01) * 1.5;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Artists for {tattooStyle}
        </Text>
        <View style={styles.headerButtons}>
          {artistsWithCoords.length > 0 && MapView && (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleView}
              activeOpacity={0.8}
              accessibilityLabel={showMap ? 'Show list' : 'Show map'}
              accessibilityRole="button"
            >
              <Text style={styles.toggleButtonText}>{showMap ? 'LIST' : 'MAP'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
            accessibilityLabel="Go back"
            accessibilityHint="Returns to the tattoo preview screen"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>BACK</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showMap && artistsWithCoords.length > 0 && MapView ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={getMapRegion()}
            showsUserLocation={!!userLocation}
            showsMyLocationButton={false}
          >
            {userLocation && Marker && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
                pinColor="#f472b6"
              />
            )}
            {artistsWithCoords.map((artist, index) => (
              Marker && (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: artist.latitude!,
                    longitude: artist.longitude!,
                  }}
                  title={artist.title}
                  description={artist.rating ? `${artist.rating.toFixed(1)} ⭐` : undefined}
                />
              )
            ))}
          </MapView>
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>
              {artistsWithCoords.length} location{artistsWithCoords.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {artists.length > 0 ? (
            <View style={styles.list}>
              {artists.map((artist, index) => (
                <View key={index} style={styles.artistCard}>
                  <View style={styles.artistInfo}>
                    <Text style={styles.artistName}>{artist.title}</Text>
                    {artist.rating && (
                      <View style={styles.ratingContainer}>
                        <StarRating rating={artist.rating} />
                        <Text style={styles.ratingText}>({artist.rating.toFixed(1)})</Text>
                        {artist.reviewCount && (
                          <Text style={styles.reviewText}>{artist.reviewCount} reviews</Text>
                        )}
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => handleOpenMap(artist.uri)}
                    activeOpacity={0.8}
                    accessibilityLabel={`View ${artist.title} on map`}
                    accessibilityHint="Opens the artist location in your map app"
                    accessibilityRole="button"
                  >
                    <Text style={styles.mapButtonText}>View Map</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              No artists found nearby specializing in this style. Try a broader style or check back
              later.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f4f4f5',
    padding: Math.min(16, SCREEN_WIDTH * 0.04),
    borderWidth: 4,
    borderColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: Math.min(20, SCREEN_WIDTH * 0.05),
    fontWeight: 'bold',
    color: '#18181b',
    flex: 1,
    flexShrink: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#f472b6',
    paddingHorizontal: Math.min(12, SCREEN_WIDTH * 0.03),
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: Math.min(12, SCREEN_WIDTH * 0.03),
    fontWeight: 'bold',
    color: '#000',
  },
  backButton: {
    backgroundColor: '#fef08a',
    paddingHorizontal: Math.min(12, SCREEN_WIDTH * 0.03),
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  backButtonText: {
    fontSize: Math.min(12, SCREEN_WIDTH * 0.03),
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  list: {
    gap: 12,
  },
  artistCard: {
    backgroundColor: '#fff',
    padding: Math.min(12, SCREEN_WIDTH * 0.03),
    borderWidth: 2,
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artistInfo: {
    flex: 1,
    flexShrink: 1,
  },
  artistName: {
    fontSize: Math.min(16, SCREEN_WIDTH * 0.04),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starContainer: {
    flexDirection: 'row',
  },
  stars: {
    fontSize: Math.min(12, SCREEN_WIDTH * 0.03),
    color: '#fbbf24',
  },
  ratingText: {
    fontSize: Math.min(12, SCREEN_WIDTH * 0.03),
    color: '#71717a',
  },
  reviewText: {
    fontSize: Math.min(12, SCREEN_WIDTH * 0.03),
    color: '#71717a',
  },
  mapButton: {
    backgroundColor: '#f472b6',
    paddingHorizontal: Math.min(12, SCREEN_WIDTH * 0.03),
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#000',
    marginLeft: 8,
  },
  mapButtonText: {
    fontSize: Math.min(12, SCREEN_WIDTH * 0.03),
    fontWeight: 'bold',
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#71717a',
    paddingVertical: 24,
    fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
  },
  mapContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.6,
    borderWidth: 4,
    borderColor: '#000',
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
  },
  mapOverlayText: {
    fontSize: Math.min(12, SCREEN_WIDTH * 0.03),
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ArtistFinder;
