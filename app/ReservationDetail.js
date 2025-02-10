import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import CustomNumberPicker from './CustomNumberPicker';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

const ReservationDetailScreen = () => {
  const { reservationId, token } = useLocalSearchParams();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const stripe = useStripe();
  const [loading, setLoading] = useState(true);
  const [payableAmount, setPayableAmount] = useState(0);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const response = await axios.get(`https://priority-i4dq.onrender.com/api/reservations/${reservationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservation(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reservation details');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [reservationId, token]);

  const handlePayment = async () => {
    const totalAmount = reservation.numberOfGuests * 25;
    try {
      const response = await axios.post('/api/stripe/create-payment-intent', {
        amount: totalAmount * 100,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { clientSecret } = response.data;

      const { error } = await stripe.confirmPayment(clientSecret, {
        type: 'Card',
        billingDetails: {
          // Add billing details here if needed
        },
      });

      if (error) {
        Alert.alert('Payment Error', error.message);
      } else {
        Alert.alert('Success', 'Your order is confirmed!');
      }
    } catch (error) {
      console.error('Payment request error:', error);
      Alert.alert('Payment Error', error.message || 'An error occurred while processing the payment.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!reservation) {
    return <Text style={styles.errorText}>No reservation details available.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation Details</Text>
      <Text>Restaurant: {reservation.restaurantId?.name || 'Unknown Restaurant'}</Text>
      <Text>Date: {new Date(reservation.date).toLocaleDateString()}</Text>
      <Text>Time: {reservation.timeSlot}</Text>
      <Text>Guests:</Text>
      <CustomNumberPicker 
        value={guests} 
        onChange={setGuests} 
      />
      <Text>Status: {reservation.status}</Text>
      <Text>Payment Status: {reservation.paymentStatus}</Text>

      {/* Conditionally render the PayPal button */}
      {reservation.paymentStatus === 'pending' && (
        <Button title="Pay Now" onPress={handlePayment} />
      )}
    </View>
  );
};

const ReservationDetail = () => {
  return (
    <StripeProvider publishableKey='pk_test_51QqVM62fAHCZqfyC9ojoLwD3tHItAw5Qhx9cAxcW9DeGn2owVISLlEmOCwzmEkfHbzbaKhnIeXz6icHpHyC3tN4M00mytpq7NX'>
      <ReservationDetailScreen />
    </StripeProvider>
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
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ReservationDetail; 