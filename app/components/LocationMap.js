import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

// Japanese-inspired dark theme for the map
const customMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#e4d4c6"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];

export default function LocationMap({ restaurant }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Location</Text>
      <Text style={styles.location}>{restaurant.location}</Text>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          customMapStyle={customMapStyle}
          initialRegion={{
            latitude: restaurant.latitude || 35.6762,
            longitude: restaurant.longitude || 139.6503,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
        >
          <Marker
            coordinate={{
              latitude: restaurant.latitude || 35.6762,
              longitude: restaurant.longitude || 139.6503,
            }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Ionicons name="location" size={24} color="#e4d4c6" />
              </View>
              <View style={styles.markerShadow} />
            </View>
          </Marker>
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e4d4c6',
    marginBottom: 12,
  },
  location: {
    color: '#e4d4c6',
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    marginVertical: 16,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#e4d4c6',
  },
  map: {
    flex: 1,
    borderRadius: 15,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  markerShadow: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(37, 34, 40, 0.4)',
    borderRadius: 4,
    marginTop: 2,
  },
}); 