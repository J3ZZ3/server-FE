import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://priority-i4dq.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the authorization header
export const setAuthHeader = async () => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Function to fetch user profile
export const fetchUserProfile = async () => {
  await setAuthHeader(); // Ensure the authorization header is set
  const response = await api.get('/auth/me'); // Fetch user profile
  return response.data; // Return the user data
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data; // Assuming the token is returned in the response
    await AsyncStorage.setItem('userToken', token); // Store the token
    await setAuthHeader(); // Set the authorization header
    console.log('Login successful:', response.data);
    console.log('Token:', token); // Log the token to check its value
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear(); // Clear all data from AsyncStorage
    console.log('All data cleared from AsyncStorage');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

export const logout = async () => {
  try {
    await clearStorage(); // Clear all data
    console.log('Logout successful');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const fetchRestaurants = async () => {
  try {
    const response = await api.get('/restaurants'); // Adjust the endpoint if necessary
    console.log('Fetched restaurants:', response.data); // Log the response data
    return response.data; // Return the restaurant data
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error.response?.data || error.message;
  }
};

export default api; 