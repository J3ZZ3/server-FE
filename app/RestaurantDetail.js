import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput, Linking } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStripe } from '@stripe/stripe-react-native';

const RestaurantDetailScreen = () => {
  const { restaurantId, token } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state variables for reservation details
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [guests, setGuests] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`https://restaurant-server-2-7mo0.onrender.com/api/restaurants/${restaurantId}`);
        setRestaurant(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const initializePayment = async () => {
    try {
      // Calculate total amount based on number of guests (e.g., $10 per person)
      const amount = Number(guests) * 1000; // Amount in cents
      
      // Get payment intent from your backend
      const response = await axios.post(
        'https://restaurant-server-2-7mo0.onrender.com/api/payments/create-payment-intent',
        {
          amount,
          currency: 'usd',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { paymentIntent, ephemeralKey, customer } = response.data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: restaurant.name,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: {
          name: 'Guest',
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return false;
      }

      return true;
    } catch (error) {
      Alert.alert('Error', 'Unable to initialize payment');
      return false;
    }
  };

  const handlePayment = async () => {
    setProcessingPayment(true);
    
    try {
      const initialized = await initializePayment();
      if (!initialized) {
        setProcessingPayment(false);
        return;
      }

      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert('Error', error.message);
        setProcessingPayment(false);
        return;
      }

      // If payment successful, proceed with reservation
      await handleReservation();
      Alert.alert('Success', 'Payment successful and reservation confirmed!');
    } catch (err) {
      Alert.alert('Error', 'Payment failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleReservation = async () => {
    try {
      const response = await axios.post(
        'https://restaurant-server-2-7mo0.onrender.com/api/reservations',
        {
          restaurantId,
          date,
          timeSlot: time.toLocaleTimeString(),
          numberOfGuests: Number(guests),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to make reservation');
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text>{restaurant.cuisine}</Text>
      <Text>{restaurant.location}</Text>
      <Text>{restaurant.description}</Text>
      
      <Text style={styles.selectedText}>Selected Date: {date.toLocaleDateString()}</Text>
      <Text style={styles.selectedText}>Selected Time: {time.toLocaleTimeString()}</Text>

      <Button title="Select Date" onPress={showDatepicker} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
      <Button title="Select Time" onPress={showTimepicker} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Number of Guests"
        value={guests}
        onChangeText={setGuests}
        keyboardType="numeric"
      />
      
      <View style={styles.buttonContainer}>
        {processingPayment ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button 
            title="Book and Pay Now" 
            onPress={handlePayment}
            disabled={!guests || Number(guests) <= 0}
          />
        )}
        <Button 
          title="Contact Restaurant" 
          onPress={() => {
            const contactNumber = restaurant.contact;
            if (contactNumber) {
              Linking.openURL(`tel:${contactNumber}`);
            } else {
              Alert.alert('No contact number available');
            }
          }} 
        />
      </View>
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
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  selectedText: {
    fontSize: 16,
    marginVertical: 8,
  },
});

export default RestaurantDetailScreen; 