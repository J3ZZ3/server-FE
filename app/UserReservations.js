import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, SafeAreaView, Image } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from './constants/colors';
import { Ionicons } from '@expo/vector-icons';
import api from './services/api';

// URL for the background image
const backgroundImage = 'https://images.pexels.com/photos/5086628/pexels-photo-5086628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

// Default restaurant image if none is provided
const defaultRestaurantImage = 'https://cdn.pixabay.com/photo/2024/09/29/17/02/soup-9083825_960_720.jpg';

const UserReservations = () => {
  const { token } = useLocalSearchParams(); // Get token from params
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/user/reservations', {
          headers: { Authorization: `Bearer ${token}` }
        });
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

  const renderReservationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.reservationItem}
      onPress={() => navigation.navigate('ReservationDetail', { reservationId: item._id, token })}
    >
      <View style={styles.card}>
        <ImageBackground 
          source={{ uri: item.restaurant?.image || defaultRestaurantImage }} 
          style={styles.restaurantImage}
          defaultSource={{ uri: defaultRestaurantImage }}
        >
          <View style={styles.overlay}>
            <View style={styles.contentContainer}>
              <View style={styles.reservationHeader}>
                <Text style={[styles.restaurantName, styles.lightText]}>{item.restaurant?.name}</Text>
                <View style={[styles.statusBadge, 
                  { backgroundColor: item.status === 'confirmed' ? Colors.success : Colors.primary }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={20} color="#fff" />
                  <Text style={[styles.detailText, styles.lightText]}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={20} color="#fff" />
                  <Text style={[styles.detailText, styles.lightText]}>{item.timeSlot}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={20} color="#fff" />
                  <Text style={[styles.detailText, styles.lightText]}>
                    {item.guests} {item.guests === 1 ? 'Guest' : 'Guests'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Reservations</Text>
        </View>

        {reservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyText}>No reservations found</Text>
            <Text style={styles.emptySubtext}>Your upcoming reservations will appear here</Text>
          </View>
        ) : (
          <FlatList
            data={reservations}
            renderItem={renderReservationItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 200, // Increased height for better visual
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better text visibility
    justifyContent: 'flex-end', // Align content to bottom
  },
  contentContainer: {
    padding: 16,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.light,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  lightText: {
    color: '#fff', // Make text white for better contrast
  },
});

export default UserReservations; 