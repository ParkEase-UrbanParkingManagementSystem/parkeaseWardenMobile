import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
export default function CheckoutScreen() {
    const { vehicle } = useLocalSearchParams();
    const vehicleString = Array.isArray(vehicle) ? vehicle[0] : vehicle;
    const parsedVehicle = vehicleString ? JSON.parse(vehicleString) : null;

    console.log('Updated Vehicle Data:', parsedVehicle);


  return (
    <View style={styles.checkout}>
      <View style={styles.cardSmallParent}>
        <View style={styles.cardSmall}>
          {/* <View style={styles.baseBlack}></View> */}
          <View style={styles.infoContainer}>
            <Text style={styles.totalFeeText}>Total Parking fee</Text>
            {/* <Text style={styles.totalFeeAmount}>{parsedVehicle.totalFee} LKR</Text> */}
            <Text style={styles.totalFeeAmount}>200 LKR</Text>

            <View style={styles.infoDetails}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Licence Plate</Text>
                <Text style={styles.infoValue}>{parsedVehicle.number}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>In Time</Text>
                <Text style={styles.infoValue}>{parsedVehicle.parkedTime}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Out Time</Text>
                <Text style={styles.infoValue}>{parsedVehicle.outTime}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duration</Text>
                {/* <Text style={styles.infoValue}>{duration}</Text> */}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.additionalInfoWrapper}>
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.additionalInfoLabel}>Parking ID</Text>
              <Text style={styles.additionalInfoValue}>{parsedVehicle.parkingId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.additionalInfoLabel}>Driver ID</Text>
              <Text style={styles.additionalInfoValue}>{parsedVehicle.driverId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.additionalInfoLabel}>Slots Allocated</Text>
              <Text style={styles.additionalInfoValue}>{parsedVehicle.allocatedSlots}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.additionalInfoLabel}>Warden ID</Text>
              <Text style={styles.additionalInfoValue}>{parsedVehicle.wardenId}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.checkoutInner}>
        <TouchableOpacity style={styles.exitButton} 
        // onPress={() => navigation.goBack()}
        >
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
    // backgroundColor: '#1a1b1e',
    padding: 20,
    marginVertical: 20,
    width: '100%',
    backgroundColor:'rgba(26, 33, 49, 1)'
  },
//   baseBlack: {
//     width: '100%',
//     height: 50,
//     borderRadius: 30,
//     backgroundColor: '#000',
//     position: 'absolute',
//     top: 0,
//   },
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

