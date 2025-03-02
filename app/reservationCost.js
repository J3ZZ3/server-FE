import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { CustomButton } from './components';

export default function ReservationCostScreen() {
  const { 
    reservationId, 
    amount, 
    token, 
    restaurantId,
    guests,
    date,
    time
  } = useLocalSearchParams();
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get(
        `https://priority-i4dq.onrender.com/api/restaurants/${restaurantId}`
      );
      setRestaurant(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    router.push({
      pathname: '/payment',
      params: {
        reservationId,
        amount,
        token
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reservation Summary</Text>
        
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant?.name}</Text>
          <Text style={styles.cuisine}>{restaurant?.cuisine}</Text>
          <Text style={styles.location}>{restaurant?.location}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <DetailRow label="Date" value={formattedDate} />
          <DetailRow label="Time" value={time} />
          <DetailRow label="Number of Guests" value={guests} />
        </View>

        <View style={styles.divider} />

        <View style={styles.costBreakdown}>
          <Text style={styles.costTitle}>Cost Breakdown</Text>
          <DetailRow 
            label="Cost per Guest" 
            value={`$25.00`} 
          />
          <DetailRow 
            label="Number of Guests" 
            value={guests} 
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${amount}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>• Reservation will be confirmed after payment</Text>
          <Text style={styles.infoText}>• Cancellation available up to 24 hours before</Text>
          <Text style={styles.infoText}>• Please arrive 10 minutes before your reservation time</Text>
        </View>
      </View>

      <CustomButton 
        title="Proceed to Payment" 
        onPress={handlePayment}
        style={styles.payButton}
      />
    </ScrollView>
  );
}

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  restaurantInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  costBreakdown: {
    marginBottom: 20,
  },
  costTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  payButton: {
    marginBottom: 30,
  },
}); 