import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Image, Animated, Linking, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from './constants/colors';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import api from './services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

const RestaurantDetailScreen = () => {
  const { restaurantId, token } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [location, setLocation] = useState(null);
  
  // Animated value for background
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await api.get(`/restaurants/${restaurantId}`);
        setRestaurant(response.data);
      } catch (error) {
        setError('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  useEffect(() => {
    // Start the animation
    const animateBackground = () => {
      animatedValue.setValue(0); // Reset the animated value
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start(() => animateBackground()); // Loop the animation
    };

    animateBackground();
  }, []);

  useEffect(() => {
    // Request location permissions and get initial location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show the map.');
        return;
      }
    })();
  }, []);

  const handleReservePress = async () => {
    try {
      // Check if token exists in AsyncStorage as fallback
      const storedToken = await AsyncStorage.getItem('userToken');
      const authToken = token || storedToken;

      if (!authToken) {
        Alert.alert(
          'Authentication Required',
          'Please log in to make a reservation',
          [
            {
              text: 'OK',
              onPress: () => router.push('/login')  // Redirect to login page
            }
          ]
        );
        return;
      }

      router.push({
        pathname: '/reservation',
        params: {
          restaurantId: restaurantId,
          restaurantName: restaurant?.name,
          token: authToken
        }
      });
    } catch (error) {
      console.error('Error in handleReservePress:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleCallPress = async () => {
    if (!restaurant?.contact) {
      Alert.alert('Error', 'No contact number available');
      return;
    }

    // Remove any non-numeric characters from the phone number
    const phoneNumber = restaurant.contact.replace(/\D/g, '');
    
    try {
      const supported = await Linking.canOpenURL(`tel:${phoneNumber}`);
      
      if (supported) {
        await Linking.openURL(`tel:${phoneNumber}`);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not make phone call');
    }
  };

  const formatOpeningHours = (hours) => {
    if (!hours) return 'Hours not available';
    return `${hours.open} - ${hours.close}`;
  };

  const getDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!restaurant) {
    return <Text style={styles.errorText}>Restaurant not found</Text>;
  }

  // Interpolating the animated value for background color
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 107, 0, 0.8)', 'rgba(255, 140, 0, 0.8)'], // Dynamic colors
  });

  // Custom map style - Japanese-inspired dark theme
  const customMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#e4d4c6"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://cdn.pixabay.com/video/2024/11/03/239700_large.mp4' }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />
      <View style={styles.overlay} />
      
      <ScrollView style={styles.scrollView}>
        <Image
          source={{ uri: restaurant.imageUrl }}
          style={styles.headerImage}
        />
        
        <View style={styles.contentContainer}>
          {/* Restaurant Name and Basic Info */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>{restaurant.rating || 4.5}</Text>
            </View>
          </View>

          {/* Quick Info Cards */}
          <View style={styles.quickInfoContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={24} color="#e4d4c6" />
              <Text style={styles.infoText}>
                Today: {formatOpeningHours(restaurant.openingHours?.[getDayOfWeek()])}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="people-outline" size={24} color="#e4d4c6" />
              <Text style={styles.infoText}>Max Group: {restaurant.maxGroupSize}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="cash-outline" size={24} color="#e4d4c6" />
              <Text style={styles.infoText}>From ${restaurant.pricing?.basePrice}/person</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
          </View>

          {/* Menu Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Items</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {restaurant.menu?.map((item, index) => (
                <View key={index} style={styles.menuItem}>
                  <Text style={styles.menuItemName}>{item.item}</Text>
                  <Text style={styles.menuItemPrice}>${item.price}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.location}>{restaurant.location}</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                mapType="satellite"
                initialRegion={{
                  latitude: restaurant.latitude || 35.6762,
                  longitude: restaurant.longitude || 139.6503,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: restaurant.latitude || 35.6762,
                    longitude: restaurant.longitude || 139.6503,
                  }}
                >
                  <View style={styles.markerContainer}>
                    <View style={styles.marker}>
                      <Ionicons name="location" size={24} color="#e4d4c6" />
                    </View>
                    <View style={styles.markerShadow} />
                  </View>
                </Marker>
              </MapView>
            </View>
          </View>

          {/* Contact and Actions */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCallPress}>
              <Ionicons name="call" size={24} color="#e4d4c6" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleReservePress}>
              <Text style={styles.primaryButtonText}>Reserve a Table</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  video: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust opacity as needed (0.5 = 50% transparent)
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    zIndex: 2, // Increased to be above both video and overlay
  },
  headerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e4d4c6',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  cuisine: {
    fontSize: 18,
    color: '#e4d4c6',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#e4d4c6',
    marginLeft: 4,
    fontSize: 16,
  },
  quickInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  infoText: {
    color: '#e4d4c6',
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e4d4c6',
    marginBottom: 12,
  },
  description: {
    color: '#e4d4c6',
    lineHeight: 24,
  },
  menuItem: {
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 150,
  },
  menuItemName: {
    color: '#e4d4c6',
    fontSize: 16,
    marginBottom: 4,
  },
  menuItemPrice: {
    color: '#e4d4c6',
    fontSize: 14,
  },
  location: {
    color: '#e4d4c6',
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#cc866f',
    flex: 2,
  },
  actionButtonText: {
    color: '#e4d4c6',
    marginLeft: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.text.light,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  mapContainer: {
    height: 200,
    marginVertical: 16,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#e4d4c6',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e4d4c6',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerShadow: {
    width: 8,
    height: 8,
    backgroundColor: '#252228',
    borderRadius: 4,
    marginTop: -4,
    transform: [{ rotate: '45deg' }],
    borderWidth: 2,
    borderColor: '#e4d4c6',
  },
});

export default RestaurantDetailScreen; 