import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomNumberPicker from './CustomNumberPicker';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationForm = ({ onSubmit, restaurantName, restaurantId }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    time: new Date(),
    guests: 1,
    name: '',
    email: '',
    phone: '',
    occasion: '',
    specialRequests: '',
    seatingPreference: 'indoor', 
    dietaryRestrictions: '',
    tablePreference: '', 
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDateValid, setIsDateValid] = useState(false);
  const [isTimeValid, setIsTimeValid] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const occasions = [
    'Regular Dining',
    'Birthday',
    'Anniversary',
    'Business Meeting',
    'Date Night',
    'Special Celebration',
    'Other'
  ];

  const seatingOptions = [
    'Indoor',
    'Outdoor',
    'No Preference'
  ];

  useEffect(() => {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setIsDateValid(selectedDate >= today);
  }, [formData.date]);

  useEffect(() => {
    const selectedTime = new Date(formData.time);
    const openingTime = new Date();
    openingTime.setHours(11, 0, 0); // 11 AM
    const closingTime = new Date();
    closingTime.setHours(22, 0, 0); // 10 PM
    setIsTimeValid(selectedTime >= openingTime && selectedTime <= closingTime);
  }, [formData.time]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [formData.date]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const formattedDate = formData.date.toISOString().split('T')[0];
      
      const response = await axios.get(
        `https://priority-i4dq.onrender.com/api/reservations/available-slots/${restaurantId}/${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.availableSlots) {
        setAvailableSlots(response.data.availableSlots);
      } else {
        // Generate default time slots if none returned
        const defaultSlots = generateDefaultTimeSlots();
        setAvailableSlots(defaultSlots);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Fallback to default time slots on error
      const defaultSlots = generateDefaultTimeSlots();
      setAvailableSlots(defaultSlots);
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour <= 21; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('date', selectedDate);
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Required Field', 'Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Required Field', 'Please enter your email');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Required Field', 'Please enter your phone number');
      return false;
    }
    if (!isDateValid) {
      Alert.alert('Invalid Date', 'Please select a future date');
      return false;
    }
    if (!isTimeValid) {
      Alert.alert('Invalid Time', 'Restaurant is open from 11 AM to 10 PM');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    onSubmit(formData);
    setShowConfirmModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter your full name"
            placeholderTextColor={Colors.text.tertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            placeholderTextColor={Colors.text.tertiary}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Enter your phone number"
            placeholderTextColor={Colors.text.tertiary}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Reservation Details</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <TouchableOpacity 
            style={[styles.dateButton, !isDateValid && styles.invalidInput]} 
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.text.dark} />
            <Text style={styles.dateButtonText}>
              {formData.date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time *</Text>
          <TouchableOpacity 
            style={[styles.dateButton, !isTimeValid && styles.invalidInput]} 
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={Colors.text.dark} />
            <Text style={styles.dateButtonText}>
              {selectedTime || 'Select Time'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Guests *</Text>
          <CustomNumberPicker 
            value={formData.guests} 
            onChange={(value) => handleInputChange('guests', value)}
            min={1}
            max={20}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Occasion</Text>
          <View style={styles.occasionContainer}>
            {occasions.map((occasion) => (
              <TouchableOpacity
                key={occasion}
                style={[
                  styles.occasionButton,
                  formData.occasion === occasion && styles.selectedOccasion
                ]}
                onPress={() => handleInputChange('occasion', occasion)}
              >
                <Text style={[
                  styles.occasionText,
                  formData.occasion === occasion && styles.selectedOccasionText
                ]}>
                  {occasion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Seating Preference</Text>
          <View style={styles.seatingContainer}>
            {seatingOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.seatingButton,
                  formData.seatingPreference === option.toLowerCase() && styles.selectedSeating
                ]}
                onPress={() => handleInputChange('seatingPreference', option.toLowerCase())}
              >
                <Text style={[
                  styles.seatingText,
                  formData.seatingPreference === option.toLowerCase() && styles.selectedSeatingText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Table Preference</Text>
          <TextInput
            style={styles.input}
            value={formData.tablePreference}
            onChangeText={(value) => handleInputChange('tablePreference', value)}
            placeholder="e.g., Window seat, Booth, Bar"
            placeholderTextColor={Colors.text.tertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dietary Restrictions</Text>
          <TextInput
            style={styles.input}
            value={formData.dietaryRestrictions}
            onChangeText={(value) => handleInputChange('dietaryRestrictions', value)}
            placeholder="Any allergies or dietary requirements?"
            placeholderTextColor={Colors.text.tertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Special Requests</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.specialRequests}
            onChangeText={(value) => handleInputChange('specialRequests', value)}
            placeholder="Any special requests or celebrations?"
            placeholderTextColor={Colors.text.tertiary}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Review Reservation</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <Modal
          visible={showTimePicker}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Time</Text>
              {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : (
                <ScrollView>
                  {availableSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.selectedTimeSlot
                      ]}
                      onPress={() => handleTimeSelect(time)}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        selectedTime === time && styles.selectedTimeSlotText
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Reservation</Text>
            <ScrollView>
              <Text style={styles.modalText}>Restaurant: {restaurantName}</Text>
              <Text style={styles.modalText}>Name: {formData.name}</Text>
              <Text style={styles.modalText}>Date: {formData.date.toLocaleDateString()}</Text>
              <Text style={styles.modalText}>Time: {selectedTime || 'Select Time'}</Text>
              <Text style={styles.modalText}>Guests: {formData.guests}</Text>
              <Text style={styles.modalText}>Phone: {formData.phone}</Text>
              <Text style={styles.modalText}>Email: {formData.email}</Text>
              {formData.occasion && (
                <Text style={styles.modalText}>Occasion: {formData.occasion}</Text>
              )}
              {formData.seatingPreference && (
                <Text style={styles.modalText}>Seating: {formData.seatingPreference}</Text>
              )}
              {formData.dietaryRestrictions && (
                <Text style={styles.modalText}>Dietary Restrictions: {formData.dietaryRestrictions}</Text>
              )}
              {formData.specialRequests && (
                <Text style={styles.modalText}>Special Requests: {formData.specialRequests}</Text>
              )}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  invalidInput: {
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  occasionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  occasionButton: {
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  selectedOccasion: {
    backgroundColor: Colors.primary,
  },
  occasionText: {
    color: Colors.text.light,
    fontSize: 14,
  },
  selectedOccasionText: {
    color: Colors.text.light,
    fontWeight: 'bold',
  },
  seatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seatingButton: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedSeating: {
    backgroundColor: Colors.primary,
  },
  seatingText: {
    color: Colors.text.light,
    fontSize: 14,
  },
  selectedSeatingText: {
    color: Colors.text.light,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: Colors.text.light,
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.overlay,
  },
  modalContent: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.dark,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: Colors.text.dark,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.danger,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  timeSlot: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedTimeSlot: {
    backgroundColor: Colors.primary,
  },
  timeSlotText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectedTimeSlotText: {
    color: Colors.text.light,
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationForm; 