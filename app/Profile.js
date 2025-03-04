import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { logout, fetchUserProfile } from './services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfileData();
    }, [])
  );

  const handleTextInputFocus = (inputName) => {
    console.log(`${inputName} input focused`);
    setIsInputFocused(true);
  };

  const handleTextInputBlur = (inputName) => {
    console.log(`${inputName} input blurred`);
    setIsInputFocused(false);
  };

  const fetchUserProfileData = async () => {
    try {
      const data = await fetchUserProfile();
      console.log('Profile response:', data);
      setUserData(data);
      setEditedName(data.name);
      setEditedEmail(data.email);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    // Validate inputs
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.put('https://priority-i4dq.onrender.com/api/auth/me', {
        name: editedName.trim(),
        email: editedEmail.trim()
      });

      // Only update the displayed data after successful save
      setUserData(response.data);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    // Reset form values to current user data
    setEditedName(userData.name);
    setEditedEmail(userData.email);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const EditProfileModal = () => (
    <Modal
      visible={isEditing}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancelEdit}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={editedName}
            onChangeText={setEditedName}
            returnKeyType="next"
            onSubmitEditing={() => {
              this.emailInput?.focus();
            }}
          />

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            ref={(input) => { this.emailInput = input; }}
            style={styles.input}
            placeholder="Enter your email"
            value={editedEmail}
            onChangeText={setEditedEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={handleCancelEdit}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <EditProfileModal />
      
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#007AFF" />
        </View>
        <Text style={styles.userName}>{userData?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{userData?.email || 'email@example.com'}</Text>
        <Text style={styles.userRole}>{userData?.role || 'user'}</Text>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={24} color="#007AFF" />
          <Text style={styles.detailText}>
            {userData?.phoneNumber || 'No phone number added'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={24} color="#007AFF" />
          <Text style={styles.detailText}>
            {userData?.address || 'No address added'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.detailItem}>
          <Ionicons name="nutrition-outline" size={24} color="#007AFF" />
          <Text style={styles.detailText}>
            {userData?.preferences?.dietaryRestrictions?.join(', ') || 'No dietary restrictions'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="restaurant-outline" size={24} color="#007AFF" />
          <Text style={styles.detailText}>
            {userData?.preferences?.favoritesCuisine?.join(', ') || 'No favorite cuisines'}
          </Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push({
            pathname: '/editProfile',
            params: { 
              userData: JSON.stringify(userData)
            }
          })}
        >
          <Ionicons name="person-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.menuText, { color: '#FF3B30' }]}>Logout</Text>
          <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: '#007AFF',
    textTransform: 'capitalize',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  menuText: {
    fontSize: 17,
    color: '#000000',
    flex: 1,
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
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
  detailsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 12,
    flex: 1,
  },
}); 