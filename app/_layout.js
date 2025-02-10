import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function Layout() {
  return (
    <StripeProvider publishableKey='pk_test_51QqVM62fAHCZqfyC9ojoLwD3tHItAw5Qhx9cAxcW9DeGn2owVISLlEmOCwzmEkfHbzbaKhnIeXz6icHpHyC3tN4M00mytpq7NX'>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: "Login",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            title: "Register",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="restaurants" 
          options={{ 
            title: "Restaurants",
            headerBackVisible: false 
          }} 
        />
        <Stack.Screen 
          name="RestaurantDetail" 
          options={{ 
            title: "Restaurant Details",
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="UserReservations" 
          options={{ 
            title: "My Reservations",
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="ReservationDetail" 
          options={{ 
            title: "Reservation Details",
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="BookingForm" 
          options={{ 
            title: "Book a Room",
            headerShown: true 
          }} 
        />
      </Stack>
    </StripeProvider>
  );
} 