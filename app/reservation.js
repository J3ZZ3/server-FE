import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ReservationForm from './components/ReservationForm';
import axios from 'axios';

export default function ReservationScreen() {
  const { restaurantId, restaurantName, token } = useLocalSearchParams();
  const router = useRouter();

  const handleReservation = async (reservationDetails) => {
    try {
      const reservationResponse = await axios.post('https://priority-i4dq.onrender.com/api/reservations', {
        restaurantId,
        date: reservationDetails.date,
        timeSlot: reservationDetails.time,
        guests: reservationDetails.guests,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.push({
        pathname: '/reservationCost',
        params: {
          reservationId: reservationResponse.data.reservation._id,
          amount: reservationDetails.guests * 25,
          token: token,
          restaurantId: restaurantId,
          guests: reservationDetails.guests,
          date: reservationDetails.date,
          time: reservationDetails.time
        }
      });
    } catch (err) {
      Alert.alert('Reservation Failed', err.response?.data?.message || 'Failed to make a reservation');
    }
  };

  return (
    <LinearGradient
      colors={['#FF6B00', '#FF8C00']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Make a Reservation</Text>
          <ReservationForm 
            onSubmit={handleReservation}
            restaurantName={restaurantName}
            restaurantId={restaurantId}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
}); 