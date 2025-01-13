import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

const UserReservations = () => {
  const { token } = useLocalSearchParams(); // Get token from params
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`https://restaurant-server-2-7mo0.onrender.com/api/user/reservations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('Fetched Reservations:', response.data); // Log the response data
        setReservations(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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

  if (!reservations || reservations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No reservations found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.reservationItem}>
            <Text style={styles.restaurantName}>{item.restaurantId ? item.restaurantId.name : 'Restaurant not found'}</Text>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <Text>Time: {item.timeSlot}</Text>
            <Text>Guests: {item.numberOfGuests || 'N/A'}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  reservationItem: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default UserReservations; 