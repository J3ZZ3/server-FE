import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, ImageBackground } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from './constants/colors';

// Background image URL
const backgroundImage = 'https://cdn.pixabay.com/photo/2024/09/29/17/02/rice-9083821_1280.jpg';

const RestaurantDetailScreen = () => {
  const { restaurantId, token } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  return (
    <ImageBackground 
      source={{ uri: backgroundImage }} 
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView}>
        <Image
          source={{ uri: restaurant?.imageUrl || 'https://cdn.pixabay.com/photo/2016/08/25/03/05/japans-1618638_1280.jpg' }}
          style={styles.headerImage}
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text style={styles.subtitle}>{restaurant.cuisine}</Text>
          <Text style={styles.location}>{restaurant.location}</Text>
          <Text style={styles.contact}>{restaurant.contact}</Text>
          <Text style={styles.description}>{restaurant.description}</Text>
          
          <View style={styles.reserveButton}>
            <Text style={styles.reserveButtonText} onPress={handleReservePress}>
              Reserve a Table
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#332e31',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: '#cc866f',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  contact: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#999999',
    lineHeight: 24,
    marginTop: 16,
  },
  reserveButton: {
    height: 55,
    marginTop: 24,
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
});

export default RestaurantDetailScreen; 