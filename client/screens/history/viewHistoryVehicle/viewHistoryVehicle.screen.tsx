import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
// import { Card, Title } from 'react-native-paper';
// import { LinearGradient } from "expo-linear-gradient";
// import colors from "../../../constants/Colors";
import { useLocalSearchParams } from 'expo-router';

export default function ViewHistoryVehicleScreen() {
    const { vehicle } = useLocalSearchParams();
    const vehicleString = Array.isArray(vehicle) ? vehicle[0] : vehicle;
    const parsedVehicle = vehicleString ? JSON.parse(vehicleString) : null;
  
  if (!parsedVehicle) {
    return (
      <View style={styles.container}>
        <Text>No vehicle data available.</Text>
      </View>
    );
  }

  // Hardcoded data
  const hardcodedData = {
    location: 'Wajira Road',
    parkingId: '7',
    wardenId: 'W1344'
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <View style={styles.header}>
        <Image style={styles.vehicleImage} source={parsedVehicle.icon } />
        <Text style={[styles.vehicleNumber, { fontFamily: "Raleway_700Bold" }]}>{parsedVehicle.number}</Text>
      </View> */}

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{hardcodedData.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Type of Vehicle</Text>
          <Text style={styles.value}>{parsedVehicle.vehicleType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>In Time</Text>
          <Text style={[styles.value, styles.highlight]}>{parsedVehicle.inTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Out Time</Text>
          <Text style={[styles.value, styles.highlight]}>{parsedVehicle.outTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Duration</Text>
          <Text style={[styles.value, styles.highlight1]}>{parsedVehicle.duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{parsedVehicle.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount</Text>
          <Text style={[styles.value, styles.highlight]}>{parsedVehicle.amount} LKR</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={[styles.value]}>{parsedVehicle.method}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, styles.highlight]}>{parsedVehicle.status}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Parking ID</Text>
          <Text style={styles.value}>{parsedVehicle.id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Driver ID</Text>
          <Text style={styles.value}>{parsedVehicle.driverId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Slots Allocated</Text>
          <Text style={styles.value}>{parsedVehicle.slotsAllocated}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Warden ID</Text>
          <Text style={styles.value}>{hardcodedData.wardenId}</Text>
        </View>
      </View>

      {/* <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.holdButton]}>
          <Text style={styles.buttonText}>Hold</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.exitButton]}>
          <Text style={styles.buttonText}>Exit Vehicle</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: 'white',
      padding: 20,
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    vehicleImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginBottom: 10,
    },
    vehicleNumber: {
      fontSize: 24,
      color: '#333',
    },
    detailsContainer: {
      width: '100%',
      backgroundColor: '#F9F9F9',
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginTop: 10,
    },
    label: {
      fontSize: 16,
      color: '#666',
      fontWeight: 'bold',
    },
    value: {
      fontSize: 16,
      color: '#333',
      fontWeight: 'bold',
    },
    highlight: {
      color: '#FFA500',
    },
    highlight1: {
        color: '#1FA665',
      },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      flex: 1,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    holdButton: {
      backgroundColor: '#FFA500',
    },
    exitButton: {
      backgroundColor: '#333',
    },
    buttonText: {
      fontSize: 16,
      color: 'white',
      fontWeight: 'bold',
    },
    errorText: {
      fontSize: 18,
      color: 'red',
      textAlign: 'center',
    },
  });
  
  