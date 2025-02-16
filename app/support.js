import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Support() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const faqs = [
    {
      question: "How do I make a reservation?",
      answer: "To make a reservation, browse restaurants and click on your chosen restaurant. Select your preferred date, time, and number of guests, then confirm your booking. You'll receive a confirmation email with your reservation details.",
      icon: "calendar-outline"
    },
    {
      question: "How can I modify or cancel my reservation?",
      answer: "You can view and manage your reservations in the 'My Reservations' section. To modify or cancel, select the reservation and choose the appropriate action. Please note that some changes may be subject to restaurant policies.",
      icon: "create-outline"
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods including credit/debit cards and pay-at-restaurant options. Payment methods may vary by restaurant. You can view available payment options during the booking process.",
      icon: "card-outline"
    },
    {
      question: "How do I update my dietary preferences?",
      answer: "You can update your dietary preferences in your profile settings. This information will be shared with restaurants to better accommodate your needs during your visit.",
      icon: "nutrition-outline"
    }
  ];

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: "mail-outline",
      action: () => Linking.openURL('mailto:support@priority.com')
    },
    {
      title: "Phone Support",
      description: "Available Mon-Fri, 9AM-5PM",
      icon: "call-outline",
      action: () => Linking.openURL('tel:+1234567890')
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: "chatbubbles-outline",
      action: () => Alert.alert('Coming Soon', 'Live chat support will be available soon!')
    }
  ];

  const handleSendFeedback = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }

    try {
      await axios.post('https://priority-i4dq.onrender.com/api/feedback', {
        message: message.trim()
      });

      Alert.alert('Thank You!', 'Your feedback has been submitted successfully');
      setMessage('');
    } catch (error) {
      console.error('Feedback error:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again later.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Ionicons name={faq.icon} size={24} color="#007AFF" style={styles.faqIcon} />
            <View style={styles.faqContent}>
              <Text style={styles.question}>{faq.question}</Text>
              <Text style={styles.answer}>{faq.answer}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        {contactMethods.map((method, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.contactItem}
            onPress={method.action}
          >
            <Ionicons name={method.icon} size={24} color="#007AFF" />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>{method.title}</Text>
              <Text style={styles.contactDescription}>{method.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Feedback</Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Share your thoughts or report an issue..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <TouchableOpacity 
          style={styles.feedbackButton}
          onPress={handleSendFeedback}
        >
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000000',
  },
  faqItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  faqIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  faqContent: {
    flex: 1,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#000000',
  },
  answer: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  contactContent: {
    flex: 1,
    marginLeft: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  contactDescription: {
    fontSize: 14,
    color: '#666666',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    height: 100,
    marginBottom: 15,
  },
  feedbackButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 