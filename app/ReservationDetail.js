import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, SafeAreaView } from 'react-native';
import api from './services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import CustomButton from './components/CustomButton';
import { Colors } from './constants/colors';
import { Ionicons } from '@expo/vector-icons';

const ReservationDetailScreen = () => {
  const { reservationId, token } = useLocalSearchParams();
  const [reservation, setReservation] = useState({
    numberOfGuests: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayPal, setShowPayPal] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const response = await api.get(`/reservations/${reservationId}`, {
          headers: { Authorization: `Bearer ${token}` }
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
      const response = await api.post('/payments/create-order', {
        amount: reservation.numberOfGuests * 25,
        reservationId: reservationId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaypalUrl(response.data.approvalUrl);
      setShowPayPal(true);
    } catch (error) {
      console.error('Payment initialization error:', error);
      Alert.alert('Error', 'Failed to initialize payment. Please try again.');
    }
  };

  const handlePayPalNavigationStateChange = async (state) => {
    if (state.url.includes('/payment/success')) {
        // Extract order ID and PayerID from URL
        const urlParams = new URLSearchParams(state.url.split('?')[1]);
        const orderId = urlParams.get('token');
        const payerId = urlParams.get('PayerID'); // PayPal returns PayerID

        if (!orderId || !payerId) {
            console.error('Missing order ID or payer ID in success URL');
            Alert.alert('Error', 'Payment verification failed');
            setShowPayPal(false);
            return;
        }

        try {
            // Capture the payment
            await api.post('/payments/capture-order', {
                orderId,
                payerId, // Send payerId to backend
                reservationId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowPayPal(false);
            Alert.alert('Success', 'Payment completed successfully!');
            router.replace('/restaurants');
        } catch (error) {
            console.error('Payment capture error:', error.response?.data || error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to complete payment');
            setShowPayPal(false);
        }
    } else if (state.url.includes('/payment/cancel')) {
        setShowPayPal(false);
        Alert.alert('Cancelled', 'Payment was cancelled');
    }
  };

  if (showPayPal) {
    return (
      <WebView
        source={{ uri: paypalUrl }}
        onNavigationStateChange={handlePayPalNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.loader}
          />
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          Alert.alert(
            'Error',
            'Failed to load payment page. Please try again.',
            [
              {
                text: 'OK',
                onPress: () => setShowPayPal(false)
              }
            ]
          );
        }}
      />
    );
  }

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
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reservation Details</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.restaurantSection}>
            <Text style={styles.restaurantName}>{reservation.restaurantId.name}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{reservation.status}</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.detailText}>
                {new Date(reservation.date).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.detailText}>
                {new Date(reservation.timeSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.detailText}>
                {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? 'Guest' : 'Guests'}
              </Text>
            </View>

            <View style={styles.paymentSection}>
              <Text style={styles.paymentTitle}>Payment Details</Text>
              <Text style={styles.amount}>
                Total Amount: ${reservation.numberOfGuests * 25}
              </Text>
              <CustomButton
                title="Pay Now"
                onPress={handlePayment}
                style={styles.payButton}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    marginTop: 44,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    margin: 16,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
  },
  detailsContainer: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 12,
  },
  guestsSection: {
    marginVertical: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paymentSection: {
    marginTop: 20,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  amount: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  payButton: {
    marginTop: 12,
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
  webViewContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
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
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReservationDetailScreen; 