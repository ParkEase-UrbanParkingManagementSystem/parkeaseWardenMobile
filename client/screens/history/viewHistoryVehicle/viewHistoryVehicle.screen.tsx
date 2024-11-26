import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
// import { Card, Title } from 'react-native-paper';
// import { LinearGradient } from "expo-linear-gradient";
// import colors from "../../../constants/Colors";
import { useLocalSearchParams } from 'expo-router';
import { differenceInMinutes, format } from 'date-fns';

export default function ViewHistoryVehicleScreen() {
    const params = useLocalSearchParams();

    // const { vehicle } = useLocalSearchParams();
    // const vehicleString = Array.isArray(vehicle) ? vehicle[0] : vehicle;
    // const parsedVehicle = vehicleString ? JSON.parse(vehicleString) : null;
    // Prioritize vehicle over params.data
    const vehicleData = typeof params.vehicle === 'string' ? JSON.parse(params.vehicle) : null;
    const data = typeof params.data === 'string' ? JSON.parse(params.data) : null;
  
    // Use vehicleData if available, otherwise use data
    const parsedData = vehicleData || data;
  
    console.log('Parsed Data:', parsedData);
  // if (!parsedVehicle) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>No vehicle data available.</Text>
  //     </View>
  //   );
  // }
  useEffect(() => {
    if (parsedData) {
      console.log('Vehicle data:', parsedData);
    }
  }, [parsedData]);
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
          <Text style={styles.value}>{parsedData.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Vehicle Number</Text>
          <Text style={styles.value}>{parsedData.vehicle_number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Type of Vehicle</Text>
          <Text style={styles.value}>{parsedData.vehicle_type_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>In Time</Text>
          <Text style={[styles.value, styles.highlight]}>{format(new Date(parsedData.in_time), 'hh.mm a')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Out Time</Text>
          <Text style={[styles.value, styles.highlight]}>{parsedData.out_time ? format(new Date(parsedData.out_time), 'hh.mm a') : 'In Progress'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Duration</Text>
          <Text style={[styles.value, styles.highlight1]}>{calculateDuration(parsedData.in_time,parsedData.out_time)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{format(new Date(parsedData.in_time), 'yyyy-MM-dd')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount</Text>
          <Text style={[styles.value, styles.highlight]}>{parsedData.toll_amount} LKR</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={[styles.value]}>{parsedData.payment_method_name == 'Released'? '-':parsedData.payment_method_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status</Text>
          <Text style={getStatusStyle(parsedData.method_id !== 4 ? 'Paid' : 'Released')}>{parsedData.method_id !=4 ? 'Paid': 'Released'}</Text>
        </View>
        {/* <View style={styles.detailRow}>
          <Text style={styles.label}>Parking ID</Text>
          <Text style={styles.value}>{parsedData.id}</Text>
        </View> */}
        {/* <View style={styles.detailRow}>
          <Text style={styles.label}>Driver ID</Text>
          <Text style={styles.value}>{parsedData.driver_name}</Text>
        </View> */}
        {/* <View style={styles.detailRow}>
          <Text style={styles.label}>Slots Allocated</Text>
          <Text style={styles.value}>{parsedData.slotsAllocated}</Text>
        </View> */}
        {/* <View style={styles.detailRow}>
          <Text style={styles.label}>Warden ID</Text>
          <Text style={styles.value}>{parsedData.warden_name}</Text>
        </View> */}
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
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Released':
      return [styles.value, styles.releasedStatus];
    case 'Paid':
      return [styles.value, styles.paidStatus];
    default:
      return styles.value;
  }
};

// Helper function to calculate duration
const calculateDuration = (inTime: string, outTime: string | null): string => {
  if (!outTime) return 'In Progress';

  const inDate = new Date(inTime);
  const outDate = new Date(outTime);

  const totalMinutes = differenceInMinutes(outDate, inDate);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}hr ${minutes}min`;
};

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
    releasedStatus: {
      color: 'red', // Change text color to red for 'Released' status
      fontWeight: 'bold',
    },
    paidStatus: {
      color: '#1FA665', // Change text color to black for 'Paid' status
      fontWeight: 'bold',
    }
  });
  
  