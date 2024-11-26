import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title } from 'react-native-paper';
import Header2 from "@/components/header2/header2";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/Colors";
import SearchInput from "@/components/common/search.input";
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../../config';
import { format, differenceInMinutes } from 'date-fns';


// const vehicleData = [
//   { id: '1', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'CAA- 2053', method:'cash', status: 'Released', duration: '1hr', date: '30/10/2019', amount: '50' },
//   { id: '2', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'ABC- 1234', method:'cash', status: 'Paid', duration: '30mins', date: '25/10/2019', amount: '30' },
//   { id: '3', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'XYZ- 5678', method:'cash', status: 'Paid', duration: '2hr', date: '20/10/2019', amount: '40' },
//   { id: '4', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'XYZ- 5678', method:'cash', status: 'In Progress', duration: '1hr 30mins', date: '20/10/2019', amount: '40' },
//   { id: '5', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'XYZ- 5678', method:'cash', status: 'Pending', duration: '1hr 05mins', date: '20/10/2019', amount: '40' },
// ];

type Vehicle = {
  driver_vehicle_id: string;
  in_time: string;
  instance_id: string;
  lot_id: string;
  out_time: string | null;
  toll_amount: number | null;
  warden_id: string;
  vehicle_number: string;
  vehicle_type_name: string;
  parking_lot_name: string;
  driver_name: string;
  warden_name: string;
  method_id: number;
  payment_method_name: string;
  name: string; //lot name

};
const HistoryScreen = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await axios.get(`${BASE_URL}/fetch_history_list`, {
        params: { user_id },
      });

      const { parked_vehicles } = response.data;
      setVehicles(parked_vehicles);
      setFilteredVehicles(parked_vehicles); // Initially set filteredVehicles same as vehicles
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleSearch = (text: string) => {
    if (!text) {
      setFilteredVehicles(vehicles); // Reset filteredVehicles when search is empty
      return;
    }
    const lowercasedText = text.toLowerCase();
    const filtered = vehicles.filter(
      (vehicle) =>
        vehicle.vehicle_number.toLowerCase().includes(lowercasedText) ||
        vehicle.vehicle_type_name.toLowerCase().includes(lowercasedText) ||
        vehicle.driver_name.toLowerCase().includes(lowercasedText)
    );
    setFilteredVehicles(filtered);
  };

  return (
    <LinearGradient
      colors={[colors.background, "white"]}
      style={{ flex: 1, paddingTop: 0 }}
    >
      <Header2 />
      <SearchInput onSearch={handleSearch} />
      <ScrollView style={styles.container}>
        {filteredVehicles.length === 0 && !loading && (
          <Text style={styles.noDataText}>
            No data available to show!
          </Text>
        )}
        {filteredVehicles.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.instance_id}
            onPress={() =>
              router.push({
                pathname: "/viewHistoryVehicle",
                params: { vehicle: JSON.stringify(vehicle) },
              })
            }
          >
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.header}>
                  <Title>{vehicle.vehicle_number}</Title>
                </View>
                <View style={styles.info}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={getStatusStyle(vehicle.method_id !== 4 ? "Paid" : "Released")}>
                      {vehicle.method_id !== 4 ? "Paid" : "Released"}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Duration:</Text>
                    <Text style={styles.value}>
                      {calculateDuration(vehicle.in_time, vehicle.out_time)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Amount:</Text>
                    <Text style={styles.valueAmount}>
                      {vehicle.toll_amount} LKR
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>
                      {format(new Date(vehicle.in_time), "yyyy-MM-dd")}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

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
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
    // existing styles...
    noDataText: {
      textAlign: "center",
      paddingTop: 50,
      fontSize: 20,
      fontWeight: "600",
    },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  header: {
    marginBottom: 16,
  },
  info: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerColumn: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  valueAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(54, 41, 183, 1)',
  },
  releasedStatus: {
    color: 'red', // Change text color to red for 'Released' status
    fontWeight: 'bold',
  },
  paidStatus: {
    color: '#1FA665', // Change text color to black for 'Paid' status
    fontWeight: 'bold',
  },
});


export default HistoryScreen;