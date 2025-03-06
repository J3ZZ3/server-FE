import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://priority-i4dq.onrender.com/api'
});

// Add token to all requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthHeader = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Authentication functions
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  try {
    // Clear the stored token
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('userData');
    
    // Clear the authorization header
    delete api.defaults.headers.common['Authorization'];
    
    // You could also make a server request to invalidate the token if needed
    // await api.post('/auth/logout');
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  const response = await api.get('/auth/me'); // Fetch user profile
  return response.data; // Return the user data
};

export const fetchRestaurants = async () => {
  const response = await api.get('/restaurants'); // Adjust the endpoint if necessary
  console.log('Fetched restaurants:', response.data); // Log the response data
  return response.data; // Return the restaurant data
};

export const createReservation = async (reservationData) => {
  try {
    // Format the data properly
    const formattedData = {
      restaurantId: reservationData.restaurantId,
      date: new Date(reservationData.date).toISOString(),
      timeSlot: reservationData.timeSlot || reservationData.time, // Handle both field names
      guests: parseInt(reservationData.guests),
      name: reservationData.name,
      email: reservationData.email,
      phone: reservationData.phone,
      occasion: reservationData.occasion || 'Regular Dining',
      specialRequests: reservationData.specialRequests || '',
      seatingPreference: (reservationData.seatingPreference || 'indoor').toLowerCase(),
      dietaryRestrictions: reservationData.dietaryRestrictions || '',
      tablePreference: reservationData.tablePreference || 'No Preference'
    };

    const response = await api.post('/reservations', formattedData);
    return response.data;
  } catch (error) {
    console.error('Reservation creation error:', error);
    throw error.response?.data || error;
  }
};

// Add these payment-related functions
export const createPayPalOrder = async (paymentData) => {
  try {
    const response = await api.post('/payments/create-order', paymentData);
    return response.data;
  } catch (error) {
    console.error('Create PayPal order error:', error.response?.data || error);
    throw error;
  }
};

export const capturePayPalOrder = async (paymentData) => {
  try {
    const response = await api.post('/payments/capture-order', paymentData);
    return response.data;
  } catch (error) {
    console.error('Capture PayPal payment error:', error.response?.data || error);
    throw error;
  }
};

// Add this with other API functions
export const requestRefund = async (refundData) => {
  try {
    const response = await api.post('/reservations/request-refund', refundData);
    return response.data;
  } catch (error) {
    console.error('Refund request error:', error.response?.data || error);
    throw error;
  }
};

export const updatePassword = async (passwordData) => {
  const response = await api.put('/auth/me/password', passwordData);
  return response.data;
};

export const updateEmail = async (emailData) => {
  const response = await api.put('/auth/me/email', emailData);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/auth/me');
  await logout(); // Call the existing logout function
  return response.data;
};

// Report-related functions
export const submitReport = async (reportData) => {
  try {
    const response = await api.post('/reports', reportData);
    return response.data;
  } catch (error) {
    console.error('Submit report error:', error.response?.data || error);
    throw error;
  }
};

export const fetchUserReports = async () => {
  try {
    const response = await api.get('/reports/my-reports');
    return response.data;
  } catch (error) {
    console.error('Fetch reports error:', error.response?.data || error);
    throw error;
  }
};

export default api; 