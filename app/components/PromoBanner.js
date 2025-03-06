import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const promoData = [
  {
    id: '1',
    title: 'Easy Reservations',
    description: 'Book your favorite restaurants in seconds',
    icon: 'calendar-outline',
    gradient: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)'],
  },
  {
    id: '2',
    title: 'Best Restaurants',
    description: 'Curated selection of top dining experiences',
    icon: 'star-outline',
    gradient: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)'],
  },
  {
    id: '3',
    title: 'Special Offers',
    description: 'Exclusive deals and promotions',
    icon: 'gift-outline',
    gradient: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)'],
  }
];

const PromoBanner = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Change content
        setCurrentIndex((prevIndex) => 
          prevIndex === promoData.length - 1 ? 0 : prevIndex + 1
        );
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentPromo = promoData[currentIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={currentPromo.gradient}
        style={styles.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={currentPromo.icon} size={28} color="#FF6B00" />
        </View>
        <Animated.View 
          style={[
            styles.textContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.title}>{currentPromo.title}</Text>
          <Text style={styles.description}>{currentPromo.description}</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  gradientCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#333333',
    opacity: 0.8,
    lineHeight: 20,
  },
});

export default PromoBanner; 