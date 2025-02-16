import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import ReservationForm from './components/ReservationForm';

const RestaurantDetailScreen = () => {
  const { restaurantId, token } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`https://priority-i4dq.onrender.com/api/restaurants/${restaurantId}`);
        setRestaurant(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const handleReservation = async (reservationDetails) => {
    try {
      const reservationResponse = await axios.post('https://priority-i4dq.onrender.com/api/reservations', {
        restaurantId,
        date: reservationDetails.date,
        timeSlot: reservationDetails.time,
        guests: reservationDetails.guests,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Reservation Successful', reservationResponse.data.message);
    } catch (err) {
      Alert.alert('Reservation Failed', err.response?.data?.message || 'Failed to make a reservation');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.restaurantInfo}>
        <Text style={styles.title}>{restaurant?.name}</Text>
        <Text style={styles.subtitle}>{restaurant?.cuisine}</Text>
        <Text style={styles.location}>{restaurant?.location}</Text>
        <Text style={styles.description}>{restaurant?.description}</Text>
      </View>

      <ReservationForm 
        onSubmit={handleReservation}
        restaurantName={restaurant?.name}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  restaurantInfo: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
});

export default RestaurantDetailScreen; 