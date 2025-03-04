import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import axios from 'axios';
import { Colors } from '../constants/colors';
import RestaurantCard from './RestaurantCard'; 
import { useNavigation } from 'expo-router';
import Navigator from '../Navigator'; // Import the Navigator component
import AsyncStorage from '@react-native-async-storage/async-storage';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigatorVisible, setNavigatorVisible] = useState(false);
  const [token, setToken] = useState(null); // State to hold the token
  const navigation = useNavigation();

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('https://priority-i4dq.onrender.com/api/restaurants');
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [searchQuery, restaurants]);

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard} 
      onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item._id })}
    >
      <RestaurantCard restaurant={item} />
    </TouchableOpacity>
  );

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Restaurants</Text>
        <TouchableOpacity onPress={() => setNavigatorVisible(true)}>
          <Text style={styles.menuButton}>Menu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisine, or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="rgba(0,0,0,0.4)"
        />
      </View>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={renderRestaurantItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <Navigator isVisible={isNavigatorVisible} onClose={() => setNavigatorVisible(false)} token={token} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  menuButton: {
    fontSize: 16,
    color: Colors.secondary,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  restaurantCard: {
    marginBottom: 20,
  },
});

export default RestaurantList;