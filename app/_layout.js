import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function Layout() {
  return (
    <StripeProvider
      publishableKey="your_publishable_key_here"
      merchantIdentifier="merchant.com.your.app" // Optional for Apple Pay
    >
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
            headerShown: true 
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
      </Stack>
    </StripeProvider>
  );
} 