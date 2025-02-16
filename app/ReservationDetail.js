import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import CustomNumberPicker from './components/CustomNumberPicker';

const ReservationDetailScreen = () => {
  const { reservationId, token } = useLocalSearchParams();
  const [reservation, setReservation] = useState({
    numberOfGuests: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const response = await axios.get(`https://priority-i4dq.onrender.com/api/reservations/${reservationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservation({
          ...response.data,
          numberOfGuests: response.data.numberOfGuests || 1,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reservation details');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [reservationId, token]);

  const handlePayment = async () => {
    try {
      // Ensure reservation and number of guests are valid
      if (!reservation || !reservation.numberOfGuests) {
        throw new Error('Invalid reservation or number of guests');
      }

      // Calculate total amount based on $25 per guest
      const totalAmount = reservation.numberOfGuests * 25;

      const response = await axios.post('https://priority-i4dq.onrender.com/api/payments/create-payment', {
        amount: totalAmount.toString(), // Convert to string for the request
        reservationId: reservationId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPaymentUrl(response.data.approvalUrl); // Set the approval URL for the WebView
    } catch (err) {
      console.error('Payment request error:', err);
      Alert.alert('Payment error', err.response?.data?.message || 'Payment failed');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation Details</Text>
      <Text>Restaurant: {reservation.restaurantId.name}</Text>
      <Text>Date: {new Date(reservation.date).toLocaleDateString()}</Text>
      <Text>Time: {reservation.timeSlot}</Text>
      <Text>Guests:</Text>
      <CustomNumberPicker 
        value={reservation.numberOfGuests} 
        onChange={(newValue) => setReservation({ ...reservation, numberOfGuests: newValue })} 
      />
      <Text>Status: {reservation.status}</Text>
      <Text>Payment Status: {reservation.paymentStatus}</Text>

      {/* Conditionally render the PayPal button */}
      {reservation.paymentStatus === 'pending' && (
        <Button title="Pay Now" onPress={handlePayment} />
      )}

      {/* Render the WebView for PayPal payment */}
      {paymentUrl && (
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('success')) {
              // Handle successful payment
              Alert.alert('Payment successful', 'Your reservation has been paid for!');
              // Optionally update the payment status in your backend
            } else if (navState.url.includes('cancel')) {
              // Handle payment cancellation
              Alert.alert('Payment cancelled', 'You have cancelled the payment.');
            }
          }}
        />
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
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ReservationDetailScreen; 