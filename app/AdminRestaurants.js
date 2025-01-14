import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Button, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { FAB } from 'react-native-paper';

export default function AdminRestaurants() {
  const { token } = useLocalSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('https://restaurant-server-5htc.onrender.com/api/restaurants', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(response.data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [token, navigation]);

  const handleDelete = async (restaurantId) => {
    try {
      await axios.delete(`https://restaurant-server-5htc.onrender.com/api/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRestaurants(restaurants.filter(restaurant => restaurant._id !== restaurantId));
      Alert.alert('Success', 'Restaurant deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete restaurant');
    }
  };

  const handleEdit = (restaurantId) => {
    navigation.navigate('EditRestaurant', { restaurantId, token });
  };

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

  if (!restaurants || restaurants.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No restaurants found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <TouchableOpacity 
              style={styles.restaurantItem}
              onPress={() => navigation.navigate('AdminRestaurantDetail', { restaurantId: item._id, token })}
            >
              <Text style={styles.restaurantName}>{item.name || 'Unnamed Restaurant'}</Text>
              <Text>{item.cuisine || 'Cuisine not specified'}</Text>
              <Text>{item.location || 'Location not specified'}</Text>
            </TouchableOpacity>
            
          </View>
        )}
      />
      <FAB
        style={styles.fab}
        icon="book"
        onPress={() => navigation.navigate('UserReservations', { userId: 'your_user_id', token })}
      />
    </View>
  );
}

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
  restaurantItem: {
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
}); 