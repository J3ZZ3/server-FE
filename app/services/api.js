import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://priority-i4dq.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    console.log('Login successful:', response.data);
    console.log('Token:', token);
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

export default api; 