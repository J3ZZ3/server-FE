import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomNumberPicker from './CustomNumberPicker';

const ReservationForm = ({ onSubmit, restaurantName }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [guests, setGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDateValid, setIsDateValid] = useState(false);
  const [isTimeValid, setIsTimeValid] = useState(false);

  useEffect(() => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setIsDateValid(selectedDate >= today);
  }, [date]);

  useEffect(() => {
    const selectedTime = new Date(time);
    const openingTime = new Date();
    openingTime.setHours(11, 0, 0); // 11 AM
    const closingTime = new Date();
    closingTime.setHours(22, 0, 0); // 10 PM
    setIsTimeValid(selectedTime >= openingTime && selectedTime <= closingTime);
  }, [time]);

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

  const handleReservationSubmit = () => {
    if (!isDateValid) {
      Alert.alert('Invalid Date', 'Please select a future date');
      return;
    }
    if (!isTimeValid) {
      Alert.alert('Invalid Time', 'Restaurant is open from 11 AM to 10 PM');
      return;
    }
    if (!guests || guests < 1) {
      Alert.alert('Invalid Guests', 'Please select number of guests');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmReservation = () => {
    onSubmit({
      date,
      time: time.toLocaleTimeString(),
      guests
    });
    setShowConfirmModal(false);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Make a Reservation</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity 
          style={[styles.dateButton, !isDateValid && styles.invalidInput]} 
          onPress={showDatepicker}
        >
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity 
          style={[styles.dateButton, !isTimeValid && styles.invalidInput]} 
          onPress={showTimepicker}
        >
          <Text>{time.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Number of Guests</Text>
        <CustomNumberPicker value={guests} onChange={setGuests} />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleReservationSubmit}
      >
        <Text style={styles.submitButtonText}>Make Reservation</Text>
      </TouchableOpacity>

      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Reservation</Text>
            <Text style={styles.modalText}>Restaurant: {restaurantName}</Text>
            <Text style={styles.modalText}>Date: {date.toLocaleDateString()}</Text>
            <Text style={styles.modalText}>Time: {time.toLocaleTimeString()}</Text>
            <Text style={styles.modalText}>Guests: {guests}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmReservation}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  invalidInput: {
    borderColor: '#ff4444',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
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
    borderRadius: 6,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationForm; 