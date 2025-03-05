import React from 'react';
import { View, StyleSheet, ScrollView, Text, ImageBackground } from 'react-native';
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
        date: reservationDetails.date.toISOString(),
        timeSlot: reservationDetails.time,
        guests: reservationDetails.guests,
        name: reservationDetails.name,
        email: reservationDetails.email,
        phone: reservationDetails.phone,
        occasion: reservationDetails.occasion,
        seatingPreference: reservationDetails.seatingPreference,
        dietaryRestrictions: reservationDetails.dietaryRestrictions,
        specialRequests: reservationDetails.specialRequests,
        tablePreference: reservationDetails.tablePreference
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
          date: reservationDetails.date.toISOString(),
          time: reservationDetails.time
        }
      });
    } catch (err) {
      Alert.alert('Reservation Failed', err.response?.data?.message || 'Failed to make a reservation');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2024/09/29/17/02/rice-9083821_1280.jpg' }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Continue Reservation</Text>
            <Text style={styles.subtitle}>{restaurantName}</Text>
          </View>
          <View style={styles.formContainer}>
            <ReservationForm 
              onSubmit={handleReservation}
              restaurantName={restaurantName}
              restaurantId={restaurantId}
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0)',

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 20,
    color: '#cc866f',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
}); 