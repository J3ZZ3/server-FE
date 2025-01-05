import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

const RestaurantDetailScreen = () => {
  const { restaurantId } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`https://restaurant-server-5htc.onrender.com/api/restaurants/${restaurantId}`);
        setRestaurant(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text>{restaurant.cuisine}</Text>
      <Text>{restaurant.location}</Text>
      <Text>{restaurant.description}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Book a Reservation" onPress={() => {/* Navigate to reservation screen */}} />
        <Button title="Contact Restaurant" onPress={() => {/* Implement contact functionality */}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default RestaurantDetailScreen; 