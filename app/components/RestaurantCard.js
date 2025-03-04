import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

// Use a URL for the placeholder image
const placeholderImage = 'https://cdn.pixabay.com/photo/2024/09/29/17/02/japan-contest-9083822_960_720.jpg'; // Example placeholder URL

const RestaurantCard = ({ restaurant }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: restaurant.imageUrl || placeholderImage }} 
        style={styles.image} 
      />
      <View style={styles.detailsContainer}>
        <View style={styles.restaurantSection}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{restaurant.status}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{new Date(restaurant.date).toLocaleDateString()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{new Date(restaurant.timeSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{restaurant.numberOfGuests} {restaurant.numberOfGuests === 1 ? 'Guest' : 'Guests'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
  },
  restaurantSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  statusBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 12,
  },
});

export default RestaurantCard; 