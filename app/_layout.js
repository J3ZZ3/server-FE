import { Stack } from 'expo-router';

export default function Layout() {
  return (
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
        name="AdminRestaurants" 
        options={{ 
          title: "Admin Restaurants",
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="AdminRestaurantDetail"
        options={{ 
          title: "Admin Restaurant Details",
          headerShown: true 
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
        name="EditRestaurant" 
        options={{ 
          title: "Edit Restaurant",
          headerShown: true 
        }} 
      />
    </Stack>
  );
} 