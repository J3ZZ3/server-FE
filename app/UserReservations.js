import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from './constants/colors';
import { Ionicons } from '@expo/vector-icons';
import api from './services/api';

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
      <View style={styles.reservationHeader}>
        <Text style={styles.restaurantName}>{item.restaurant?.name}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.detailText}>
            {new Date(item.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{item.timeSlot}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{item.guests} {item.guests === 1 ? 'Guest' : 'Guests'}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons name="chevron-forward" size={24} color={Colors.text.tertiary} />
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
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginTop: 44, // Add space at the top
  },
  listContainer: {
    padding: 16,
  },
  reservationItem: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
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
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginLeft: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 12,
    alignItems: 'flex-end',
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
});

export default UserReservations; 