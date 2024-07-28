import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function CheckoutScreen() {
  const { vehicle } = useLocalSearchParams();
  const router = useRouter(); // Initialize the router hook
  const vehicleString = Array.isArray(vehicle) ? vehicle[0] : vehicle;
  const parsedVehicle = vehicleString ? JSON.parse(vehicleString) : null;

  const [duration, setDuration] = useState('');
  const [roundedDuration, setRoundedDuration] = useState('');
  const [totalFee, setTotalFee] = useState(0);

  useEffect(() => {
    if (parsedVehicle) {
      const inTime = new Date(parsedVehicle.in_time);
      const [outHours, outMinutes, outPeriod] = parsedVehicle.outTime.split(/[:\s]/);
      const outTime = new Date(inTime);

      // Adjust the hours based on AM/PM period
      let hours = parseInt(outHours, 10);
      if (outPeriod.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
      } else if (outPeriod.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }
      outTime.setHours(hours, parseInt(outMinutes, 10));

      const durationInMs = outTime.getTime() - inTime.getTime();
      const durationInMinutes = Math.floor(durationInMs / (1000 * 60));
      const hoursDuration = Math.floor(durationInMinutes / 60);
      const minutesDuration = durationInMinutes % 60;

      setDuration(`${hoursDuration} hours, ${minutesDuration} minutes`);

      // Calculate rounded-up duration in hours
      const roundedHours = Math.ceil(durationInMinutes / 60);
      setRoundedDuration(`${roundedHours} hours`);

      // Calculate the total parking fee
      let ratePerHour = 0;
      switch (parsedVehicle.vehicle_type_name) {
        case 'Car':
          ratePerHour = 70;
          break;
        case 'Bike':
        case 'Threewheeler':
          ratePerHour = 50;
          break;
        case 'Large Vehicle':
          ratePerHour = 100;
          break;
        default:
          ratePerHour = 0;
      }
      setTotalFee(roundedHours * ratePerHour);
    }
  }, [parsedVehicle]);

  const handleExitVehicle = async () => {
    try {
      const response = await axios.post('http://172.20.10.3:5000/exit-vehicle', {
        instance_id: parsedVehicle.instance_id,
        amount: totalFee,
        out_time: parsedVehicle.outTime
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Vehicle exited successfully', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') } // Navigate to home screen
        ]);
      } else {
        Alert.alert('Error', 'Failed to exit vehicle');
      }
    } catch (error) {
      console.error('Error exiting vehicle:', error);
      Alert.alert('Error', 'An error occurred while exiting vehicle');
    }
  };

  return (
    <View style={styles.checkout}>
      <View style={styles.cardSmallParent}>
        <View style={styles.cardSmall}>
          <View style={styles.infoContainer}>
            <Text style={styles.totalFeeText}>Total Parking fee</Text>
            <Text style={styles.totalFeeAmount}>{totalFee} LKR</Text>

            <View style={styles.infoDetails}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Licence Plate</Text>
                <Text style={styles.infoValue}>{parsedVehicle.vehicle_number}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{new Date(parsedVehicle.in_time).toLocaleDateString()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>In Time</Text>
                <Text style={styles.infoValue}>{new Date(parsedVehicle.in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Out Time</Text>
                <Text style={styles.infoValue}>{parsedVehicle.outTime}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{duration}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rounded Hours</Text>
                <Text style={styles.infoValue}>{roundedDuration}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.additionalInfoWrapper}>
          <View style={styles.additionalInfo}>
          <View style={styles.infoRow}>
              <Text style={styles.additionalInfoLabel}>Vehicle Type</Text>
              <Text style={styles.additionalInfoValue}>{parsedVehicle.vehicle_type_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.additionalInfoLabel}>Driver Name</Text>
              <Text style={styles.additionalInfoValue}>{parsedVehicle.driver_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.additionalInfoLabel}>Warden Name</Text>
              <Text style={styles.additionalInfoValue}>{parsedVehicle.warden_name}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.checkoutInner}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExitVehicle}>
          <Text style={styles.exitButtonText}>Exit Vehicle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkout: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 30,
    paddingHorizontal: 18,
    flexDirection: 'column',
  },
  cardSmallParent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardSmall: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 30,
    padding: 20,
    marginVertical: 20,
    width: '100%',
    backgroundColor: 'rgba(26, 33, 49, 1)',
  },
  infoContainer: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  totalFeeText: {
    color: '#aaa',
    fontSize: 18,
  },
  totalFeeAmount: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  infoDetails: {
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 16,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
  },
  additionalInfoWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  additionalInfo: {
    width: '100%',
  },
  additionalInfoLabel: {
    color: '#777',
    fontSize: 16,
  },
  additionalInfoValue: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutInner: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  exitButton: {
    backgroundColor: '#1a1b1e',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
