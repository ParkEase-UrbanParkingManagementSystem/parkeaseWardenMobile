import React from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native';
import { router } from "expo-router";


// Mock data for demonstration purposes
const vehicles = [

  {
    parkingId: 7,
    number: 'CAA - 2055',
    type: 'car',
    icon: require('@/assets/icons/car.png'),
    parkedTime: '01:00AM',
    Date: '2021-09-01',
    parkingZone: 'Wajira Road',
    slots: 1,
    driverId: 13,
    wardenId: 1,
    allocatedSlots:1,
    showHoldReleaseButtons: true, // This is a placeholder for the condition to show buttons
    holdButton: true,
    releaseButton: false,
  },
  {
    parkingId: 8,
    number: 'XYZ789',
    type: 'bike',
    icon: require('@/assets/icons/bike.png'),
    parkedTime: '02:00PM',
    Date: '2021-09-01',
    parkingZone: 'Main Street',
    slots: 1,
    driverId: 14,
    wardenId: 2,
    allocatedSlots:2,
    showHoldReleaseButtons: false,
    holdButton: false,
    releaseButton: true,
  },
];

const VehicleTemplate = () => {
  return (
    <View style={styles.container}>

      {vehicles.map((vehicle, index) => (
    // <TouchableOpacity onPress={() => router.push("/(routes)/viewParkedVehicle")} style={styles.vehicleTemplateBtn}>
    <TouchableOpacity onPress={() => router.push({
      pathname: "/(routes)/viewParkedVehicle" ,
      params: {vehicle: JSON.stringify(vehicle)},
      })
      } style={styles.vehicleTemplateBtn}>

        <View key={index} style={styles.vehicleBox}>
          <View style={styles.textContainer}>
            <Text style={styles.vehicleNumber}>{vehicle.number}</Text>
            <Text style={styles.vehicleType}>{vehicle.type}</Text>
          </View>
          <Image style={styles.vehicleIcon} source={vehicle.icon} />
        </View>
        </TouchableOpacity>

      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  vehicleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(213, 205, 205, 1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  textContainer: {
    flexDirection: 'column',
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  vehicleType: {
    fontSize: 16,
    color: 'gray',
  },
  vehicleIcon: {
    width: 40,
    height: 40,
  },

  vehicleTemplateBtn:{

  },
});

export default VehicleTemplate;
