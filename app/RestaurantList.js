import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground 
} from 'react-native';
import axios from 'axios';
import { Colors } from './constants/colors';
import RestaurantCard from './components/RestaurantCard'; 
import { useNavigation } from 'expo-router';
import Navigator from './Navigator'; // Import the Navigator component
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

// URL for the background image
const backgroundImage = 'https://images.pexels.com/photos/5086628/pexels-photo-5086628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'; // Replace with your image URL

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
    <ImageBackground source={{ uri: backgroundImage }} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dine Ease</Text>
          <TouchableOpacity onPress={() => setNavigatorVisible(true)} style={styles.menuButton}>
            <Ionicons name="menu-outline" size={24} color={Colors.text.primary} />
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    paddingTop: 30,
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
    padding: 10,
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