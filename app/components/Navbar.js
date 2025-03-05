import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logoSvg = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  width="100%" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve">
  <!-- ... existing SVG paths ... -->
</svg>`;

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    {
      label: 'Profile',
      icon: 'person-outline',
      onPress: () => router.push('/profile'),
    },
    {
      label: 'My Reservations',
      icon: 'calendar-outline',
      onPress: () => router.push('/UserReservations'),
    },
    {
      label: 'Settings',
      icon: 'settings-outline',
      onPress: () => router.push('/settings'),
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
          <SvgXml xml={logoSvg} width={40} height={40} />
          <Text style={styles.title}>DineEase</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.profileButton}
          >
            <Ionicons name="person-circle-outline" size={32} color="#cc866f" />
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
                  <Ionicons name={item.icon} size={24} color="#cc866f" />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#cc866f',
  },
  rightSection: {
    position: 'relative',
  },
  profileButton: {
    padding: 4,
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
    top: 60,
    right: 16,
    zIndex: 1000,
  },
  menu: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
}); 