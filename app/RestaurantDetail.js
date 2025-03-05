import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Image, Animated, Linking } from 'react-native';
import { Video } from 'expo-av';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from './constants/colors';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

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
        const response = await axios.get(`https://priority-i4dq.onrender.com/api/restaurants/${restaurantId}`);
        setRestaurant(response.data);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setError(err.response?.data?.message || 'Failed to fetch restaurant details');
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

  const handleReservePress = () => {
    router.push({
      pathname: '/reservation',
      params: {
        restaurantId: restaurantId,
        restaurantName: restaurant?.name,
        token: token
      }
    });
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

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://cdn.pixabay.com/video/2024/11/03/239700_large.mp4' }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping
      />
      <View style={styles.overlay} />
      <ScrollView style={styles.scrollView}>
        <Image
          source={{ uri: restaurant?.imageUrl || 'https://cdn.pixabay.com/photo/2024/09/29/17/02/windows-9083830_960_720.jpg' }}
          style={styles.headerImage}
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text style={styles.subtitle}>{restaurant.cuisine}</Text>
          <Text style={styles.location}>{restaurant.location}</Text>
          <Text style={[styles.contact, styles.clickable]} onPress={handleCallPress}>
            {restaurant.contact}
          </Text>
          <Text style={styles.description}>{restaurant.description}</Text>
          
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: restaurant.latitude || 0,
                longitude: restaurant.longitude || 0,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: restaurant.latitude || 0,
                  longitude: restaurant.longitude || 0,
                }}
                title={restaurant.name}
                description={restaurant.location}
              />
            </MapView>
          </View>

          <View style={styles.reserveButton}>
            <Text style={styles.reserveButtonText} onPress={handleReservePress}>
              Reserve a Table
            </Text>
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
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)', // Semi-transparent background for readability
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -15,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: -4,
    }
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  location: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  contact: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  clickable: {
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginTop: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  reserveButton: {
    height: 55,
    marginTop: 15,
    borderRadius: 20,
    backgroundColor: '#cc866f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
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
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default RestaurantDetailScreen; 