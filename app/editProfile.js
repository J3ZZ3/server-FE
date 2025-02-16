import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function EditProfile() {
  const router = useRouter();
  const { userData } = useLocalSearchParams();
  const parsedUserData = JSON.parse(userData);
  
  const [editedName, setEditedName] = useState(parsedUserData.name);
  const [phoneNumber, setPhoneNumber] = useState(parsedUserData.phoneNumber || '');
  const [address, setAddress] = useState(parsedUserData.address || '');
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    parsedUserData.preferences?.dietaryRestrictions?.join(', ') || ''
  );
  const [favoritesCuisine, setFavoritesCuisine] = useState(
    parsedUserData.preferences?.favoritesCuisine?.join(', ') || ''
  );

  const handleUpdateProfile = async () => {
    try {
      // Validate required fields
      if (!editedName.trim()) {
        Alert.alert('Error', 'Name is required');
        return;
      }

      const updatedProfile = {
        name: editedName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        preferences: {
          dietaryRestrictions: dietaryRestrictions
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0),
          favoritesCuisine: favoritesCuisine
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0)
        }
      };

      const response = await axios.put(
        'https://priority-i4dq.onrender.com/api/auth/me',
        updatedProfile
      );

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      
      <Text style={styles.inputLabel}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={editedName}
        onChangeText={setEditedName}
        returnKeyType="next"
      />

      <Text style={styles.inputLabel}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        returnKeyType="next"
      />

      <Text style={styles.inputLabel}>Address</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter your address"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.inputLabel}>Dietary Restrictions</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter dietary restrictions (comma-separated)"
        value={dietaryRestrictions}
        onChangeText={setDietaryRestrictions}
        multiline
        numberOfLines={2}
      />

      <Text style={styles.inputLabel}>Favorite Cuisines</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter favorite cuisines (comma-separated)"
        value={favoritesCuisine}
        onChangeText={setFavoritesCuisine}
        multiline
        numberOfLines={2}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleUpdateProfile}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666666',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  multilineInput: {
    height: null,
    minHeight: 60,
    paddingTop: 10,
    paddingBottom: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 