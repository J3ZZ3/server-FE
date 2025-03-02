import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const RestaurantCard = ({ restaurant, onReservePress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.restaurantSection}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{restaurant.status}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
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

      <TouchableOpacity style={styles.reserveButton} onPress={onReservePress}>
        <Text style={styles.reserveButtonText}>Make a Reservation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  restaurantSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  detailsContainer: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 12,
  },
  reserveButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RestaurantCard; 