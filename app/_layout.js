import { Stack } from 'expo-router';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RestaurantsScreen from './(auth)/restaurants';
import ProfileScreen from './(auth)/profile';
import SettingsScreen from './(auth)/settings';

const Tab = createBottomTabNavigator();

// Create a separate component for the Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="restaurants" 
        component={RestaurantsScreen} 
        options={{ title: "Restaurants" }} 
      />
      <Tab.Screen 
        name="profile" 
        component={ProfileScreen}
        options={{ title: "Profile" }} 
      />
      <Tab.Screen 
        name="settings" 
        component={SettingsScreen}
        options={{ title: "Settings" }} 
      />
    </Tab.Navigator>
  );
};

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
        name="RestaurantDetail" 
        options={{ 
          title: "Restaurant Details",
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="main"
        component={MainTabNavigator} 
        options={{ headerShown: false }}
      />
    </Stack>
  );
} 