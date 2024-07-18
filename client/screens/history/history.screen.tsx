import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title } from 'react-native-paper';
import Header2 from "@/components/header2/header2";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/Colors";
import SearchInput from "@/components/common/search.input";
import { useRouter } from 'expo-router';

const vehicleData = [
  { id: '1', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'CAA- 2053', method:'cash', status: 'Released', duration: '1hr', date: '30/10/2019', amount: '50' },
  { id: '2', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'ABC- 1234', method:'cash', status: 'Paid', duration: '30mins', date: '25/10/2019', amount: '30' },
  { id: '3', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'XYZ- 5678', method:'cash', status: 'Paid', duration: '2hr', date: '20/10/2019', amount: '40' },
  { id: '4', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'XYZ- 5678', method:'cash', status: 'In Progress', duration: '1hr 30mins', date: '20/10/2019', amount: '40' },
  { id: '5', driverId:'2', vehicleType:'car', slotsAllocated:'1', inTime:'02:00PM', outTime:'02:00PM', license: 'XYZ- 5678', method:'cash', status: 'Pending', duration: '1hr 05mins', date: '20/10/2019', amount: '40' },
];

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <LinearGradient 
      colors={[colors.background, "white"]}
      style={{ flex: 1, paddingTop: 0 }}
    >
      <Header2 />
      <SearchInput />
      <ScrollView style={styles.container}>
        {vehicleData.map(vehicle => (
          <TouchableOpacity key={vehicle.id} onPress={() => router.push({
            pathname: "/viewHistoryVehicle",
            params: { vehicle: JSON.stringify(vehicle) }
          })}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.header}>
                  <Title>{vehicle.license}</Title>
                </View>
                <View style={styles.info}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={getStatusStyle(vehicle.status)}>{vehicle.status}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Duration:</Text>
                    <Text style={styles.value}>{vehicle.duration}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Amount:</Text>
                    <Text style={styles.valueAmount}>{vehicle.amount} LKR</Text>
                  </View>
                </View>
                <View style={styles.footer}>
                  <View style={styles.footerColumn}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{vehicle.date}</Text>
                  </View>
                  {/* <View style={styles.footerColumn}>
                    <Text style={styles.label}>Amount:</Text>
                    <Text style={styles.valueAmount}>{vehicle.amount} LKR</Text>
                  </View> */}
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  )
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
