import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { logout } from '../services/api';
import { SvgXml } from 'react-native-svg';
import Logo from '../../assets/mylogo.svg';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Logout",
            onPress: async () => {
              await logout();
              router.replace('/login');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const menuItems = [
    {
      label: 'Profile',
      icon: 'person-outline',
      onPress: () => router.push('/Profile'),
    },
    {
      label: 'My Reservations',
      icon: 'calendar-outline',
      onPress: () => router.push('/UserReservations'),
    },
    {
      label: 'Settings',
      icon: 'settings-outline',
      onPress: () => router.push('/Settings'),
    },
    {
      label: 'Logout',
      icon: 'log-out-outline',
      onPress: handleLogout,
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>Omakase</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.profileButton}
          >
            <Ionicons name="person-circle-outline" size={40} color="#e4d4c6" />
          </TouchableOpacity>
        </View>
      </View>

      {showMenu && (
        <Pressable
          style={styles.overlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menu}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    item.onPress();
                    setShowMenu(false);
                  }}
                >
                  <Ionicons name={item.icon} size={24} color="#252228" />
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    
    zIndex: 1,
    marginTop: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e4d4c6',
    letterSpacing: 2,
    textShadowColor: '#252228',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 0,
    textShadowColor: '#252228',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 0,
    textShadowColor: '#252228',
    textShadowOffset: { width: 1, height: -1 },
    textShadowRadius: 0,
    textShadowColor: '#252228',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 0,
    textShadowColor: '#252228',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    fontFamily: Platform.OS === 'ios' ? 'Hiragino Mincho ProN' : 'serif',
  },
  rightSection: {
    position: 'relative',
  },
  profileButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 50,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  menuContainer: {
    position: 'absolute',
    top: 70,
    right: 16,
    zIndex: 1000,
  },
  menu: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  logo: {
    width: 60,
    height: 60,
    right: 13,
  },
}); 