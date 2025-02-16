import { Stack } from 'expo-router';
import { TouchableOpacity, Alert, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RootLayout() {
  const handleProfilePress = () => {
    router.push('/Navigator');
  };

  return (
    <Stack screenOptions={{
      headerShown: true,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
    }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Login', headerShown: false }} />
      <Stack.Screen 
        name="restaurants" 
        options={{ 
          headerTitle: 'Restaurants',
          headerBackVisible: false,
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleProfilePress}
              style={styles.profileButton}
            >
              <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen name="register" options={{ headerTitle: 'Register', headerShown: false }} />
      <Stack.Screen name="RestaurantDetail" options={{ headerTitle: 'Restaurant Details', headerShown: false }} />
      <Stack.Screen name="ReservationDetail" options={{ headerTitle: 'Reservation Details', headerShown: false }} />
      <Stack.Screen name="UserReservations" options={{ headerTitle: 'My Reservations' }} />
      <Stack.Screen 
        name="Navigator"
        options={{ 
          headerTitle: 'Menu',
          presentation: 'modal',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="Profile" 
        options={{ 
          headerTitle: 'Profile',
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  profileButton: {
    marginRight: 15,
    padding: 5,
  }
}); 