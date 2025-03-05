import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import api from './services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import CustomButton from './components/CustomButton';
import { Colors } from './constants/colors';
import { Ionicons } from '@expo/vector-icons';

const backgroundImage = 'https://images.pexels.com/photos/5086628/pexels-photo-5086628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const defaultRestaurantImage = 'https://via.placeholder.com/200x200.png?text=No+Image+Available';

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
        
        // Ensure we have the complete reservation data
        const reservationData = response.data;
        setReservation(reservationData);
        
        console.log('Fetched reservation:', reservationData); // For debugging
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
    <ImageBackground source={{ uri: backgroundImage }} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Reservation Details</Text>
          </View>

          <View style={styles.card}>
            <ImageBackground 
              source={{ uri: reservation.restaurantId?.image || defaultRestaurantImage }} 
              style={styles.restaurantImage}
              defaultSource={{ uri: defaultRestaurantImage }}
            >
              <View style={styles.overlay}>
                <View style={styles.contentContainer}>
                  <View style={styles.restaurantSection}>
                    <Text style={[styles.restaurantName, styles.lightText]}>
                      {reservation.restaurantId?.name || 'Restaurant'}
                    </Text>
                    <View style={[styles.statusBadge, 
                      { backgroundColor: reservation.status === 'confirmed' ? Colors.success : Colors.primary }]}>
                      <Text style={styles.statusText}>{reservation.status}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.detailsSection}>
              <View style={styles.sectionTitle}>
                <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
                <Text style={styles.sectionTitleText}>Reservation Information</Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Date</Text>
                  </View>
                  <Text style={styles.valueText}>
                    {new Date(reservation.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Time</Text>
                  </View>
                  <Text style={styles.valueText}>{reservation.timeSlot}</Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Party Size</Text>
                  </View>
                  <Text style={styles.valueText}>
                    {reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}
                  </Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Reserved By</Text>
                  </View>
                  <Text style={styles.valueText}>{reservation.name}</Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Contact</Text>
                  </View>
                  <Text style={styles.valueText}>{reservation.phone}</Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Email</Text>
                  </View>
                  <Text style={styles.valueText}>{reservation.email}</Text>
                </View>
              </View>

              {(reservation.occasion || reservation.seatingPreference || reservation.specialRequests) && (
                <View style={styles.additionalDetails}>
                  <View style={styles.sectionTitle}>
                    <Ionicons name="list-outline" size={24} color={Colors.primary} />
                    <Text style={styles.sectionTitleText}>Additional Details</Text>
                  </View>

                  {reservation.occasion && (
                    <View style={styles.detailBlock}>
                      <View style={styles.infoRow}>
                        <Ionicons name="gift-outline" size={20} color={Colors.primary} />
                        <Text style={styles.labelText}>Occasion</Text>
                      </View>
                      <Text style={styles.valueText}>{reservation.occasion}</Text>
                    </View>
                  )}

                  {reservation.seatingPreference && (
                    <View style={styles.detailBlock}>
                      <View style={styles.infoRow}>
                        <Ionicons name="restaurant-outline" size={20} color={Colors.primary} />
                        <Text style={styles.labelText}>Seating Preference</Text>
                      </View>
                      <Text style={styles.valueText}>{reservation.seatingPreference}</Text>
                    </View>
                  )}

                  {reservation.specialRequests && (
                    <View style={styles.detailBlock}>
                      <View style={styles.infoRow}>
                        <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
                        <Text style={styles.labelText}>Special Requests</Text>
                      </View>
                      <Text style={styles.valueText}>{reservation.specialRequests}</Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.paymentSection}>
                <View style={styles.sectionTitle}>
                  <Ionicons name="card-outline" size={24} color={Colors.primary} />
                  <Text style={styles.sectionTitleText}>Payment Details</Text>
                </View>
                
                <View style={styles.paymentDetails}>
                  <Text style={styles.amount}>
                    Total Amount: ${reservation.guests * 25}
                  </Text>
                  <Text style={styles.paymentStatus}>
                    Status: {reservation.paymentStatus?.charAt(0).toUpperCase() + 
                            reservation.paymentStatus?.slice(1)}
                  </Text>
                </View>

                {reservation.paymentStatus !== 'completed' && (
                  <CustomButton
                    title="Pay Now"
                    onPress={handlePayment}
                    style={styles.payButton}
                  />
                )}
                {reservation.paymentStatus === 'completed' && (
                  <View style={styles.paymentComplete}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                    <Text style={styles.paymentCompleteText}>Payment Completed</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
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
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 16,
  },
  restaurantSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  detailsSection: {
    padding: 20,
    backgroundColor: Colors.card,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailBlock: {
    width: '48%',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  valueText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  additionalDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paymentSection: {
    padding: 20,
    backgroundColor: Colors.card,
  },
  paymentDetails: {
    marginBottom: 16,
  },
  amount: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  paymentStatus: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 8,
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
  payButton: {
    marginTop: 12,
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
  paymentComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: Colors.success + '20', // Add slight transparency
    borderRadius: 8,
  },
  paymentCompleteText: {
    marginLeft: 8,
    color: Colors.success,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReservationDetailScreen; 