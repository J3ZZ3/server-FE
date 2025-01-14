import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useNavigation } from 'expo-router';

const AdminRestaurantDetailScreen = () => {
  const { restaurantId, token } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`https://restaurant-server-2-7mo0.onrender.com/api/restaurants/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurant(response.data);
        // Set initial values for the editable fields
        setName(response.data.name);
        setLocation(response.data.location);
        setCuisine(response.data.cuisine);
        setDescription(response.data.description);
        setContact(response.data.contact);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId, token]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://restaurant-server-2-7mo0.onrender.com/api/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Success', 'Restaurant deleted successfully');
      navigation.navigate('AdminRestaurants'); // Navigate back to the restaurant list
    } catch (err) {
      Alert.alert('Error', 'Failed to delete restaurant');
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://restaurant-server-2-7mo0.onrender.com/api/restaurants/${restaurantId}`, {
        name,
        location,
        cuisine,
        description,
        contact,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRestaurant(response.data); // Update the restaurant state with the new data
      setIsEditing(false); // Disable editing mode
      Alert.alert('Success', 'Restaurant details updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update restaurant details');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!restaurant) {
    return <Text>No restaurant details found</Text>;
  }

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Cuisine"
            value={cuisine}
            onChangeText={setCuisine}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact"
            value={contact}
            onChangeText={setContact}
          />
          <View style={styles.buttonContainer}>
            <Button title="Update" onPress={handleUpdate} />
            <Button title="Cancel" onPress={() => setIsEditing(false)} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text>Cuisine: {restaurant.cuisine || 'Not specified'}</Text>
          <Text>Location: {restaurant.location || 'Not specified'}</Text>
          <Text>Description: {restaurant.description || 'Not specified'}</Text>
          <Text>Contact: {restaurant.contact || 'Not specified'}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Edit" onPress={handleEdit} />
            <Button title="Delete" onPress={handleDelete} />
          </View>
        </>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default AdminRestaurantDetailScreen;