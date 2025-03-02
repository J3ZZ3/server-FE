import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const AddRestaurantScreen = () => {
  const { token } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [specialOccasionFee, setSpecialOccasionFee] = useState('');
  const [weekendSurcharge, setWeekendSurcharge] = useState('');
  const [holidaySurcharge, setHolidaySurcharge] = useState('');
  const [minimumSpend, setMinimumSpend] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [image, setImage] = useState(null); // State for the uploaded image
  const [openingHours, setOpeningHours] = useState({
    monday: { open: '', close: '' },
    tuesday: { open: '', close: '' },
    wednesday: { open: '', close: '' },
    thursday: { open: '', close: '' },
    friday: { open: '', close: '' },
    saturday: { open: '', close: '' },
    sunday: { open: '', close: '' },
  });
  const [seatingOptions, setSeatingOptions] = useState({
    indoor: true,
    outdoor: false,
  });

  const handleAddRestaurant = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('cuisine', cuisine);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('contact', contact);
    formData.append('basePrice', basePrice);
    formData.append('specialOccasionFee', specialOccasionFee);
    formData.append('weekendSurcharge', weekendSurcharge);
    formData.append('holidaySurcharge', holidaySurcharge);
    
    // Check if an image is uploaded or a URL is provided
    if (image) {
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || 'restaurant_image.jpg',
      });
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl); // Send the URL if provided
    }

    try {
      const response = await axios.post('https://priority-i4dq.onrender.com/api/restaurants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Success', 'Restaurant added successfully!');
      // Optionally navigate back or reset form
    } catch (error) {
      console.error('Error adding restaurant:', error);
      Alert.alert('Error', 'Failed to add restaurant');
    }
  };

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result); // Set the selected image
      setImageUrl(''); // Clear the URL input if an image is selected
    }
  };

  return (
    <LinearGradient
      colors={['#FF6B00', '#FF8C00']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Add Restaurant</Text>
          <TextInput placeholder="Restaurant Name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Cuisine" value={cuisine} onChangeText={setCuisine} style={styles.input} />
          <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />
          
          {/* Button to upload an image */}
          <Button title="Upload Image" onPress={pickImage} color="#FF6B00" />
          <Text>{image && `Image selected: ${image.uri}`}</Text>
          
          <TextInput placeholder="Image URL" value={imageUrl} onChangeText={setImageUrl} style={styles.input} />
          <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} multiline numberOfLines={4} />
          <TextInput placeholder="Contact" value={contact} onChangeText={setContact} style={styles.input} />
          <TextInput placeholder="Base Price" value={basePrice} onChangeText={setBasePrice} style={styles.input} keyboardType="numeric" />
          <TextInput placeholder="Special Occasion Fee" value={specialOccasionFee} onChangeText={setSpecialOccasionFee} style={styles.input} keyboardType="numeric" />
          <TextInput placeholder="Weekend Surcharge" value={weekendSurcharge} onChangeText={setWeekendSurcharge} style={styles.input} keyboardType="numeric" />
          <TextInput placeholder="Holiday Surcharge" value={holidaySurcharge} onChangeText={setHolidaySurcharge} style={styles.input} keyboardType="numeric" />
          <TextInput placeholder="Minimum Spend" value={minimumSpend} onChangeText={setMinimumSpend} style={styles.input} keyboardType="numeric" />
          <TextInput placeholder="Deposit Amount" value={depositAmount} onChangeText={setDepositAmount} style={styles.input} keyboardType="numeric" />
          {/* Add inputs for opening hours and seating options as needed */}
          <Button title="Add Restaurant" onPress={handleAddRestaurant} color="#FF6B00" />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default AddRestaurantScreen; 