import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../constants/Colors';
import Header from '@/components/header/header';
import { router, useFocusEffect } from 'expo-router';
import SearchInput from '@/components/common/searchHome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { BASE_URL } from '../../config';

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
  vehicle_type_id: number;
};

const HomeScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]); // State for filtered vehicles
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wardenAssigned, setWardenAssigned] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const response = await axios.get(`${BASE_URL}/fetch_parked_vehicles`, {
        params: { user_id },
      });

      const { is_assigned, parked_vehicles } = response.data;
      setVehicles(parked_vehicles);
      setFilteredVehicles(parked_vehicles); // Initialize filtered vehicles
      setWardenAssigned(is_assigned);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Handle Search Input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = vehicles.filter(vehicle =>
      vehicle.vehicle_number.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVehicles(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <LinearGradient colors={[colors.background, 'white']} style={{ flex: 1, paddingTop: 0 }}>
      <Header />
      {wardenAssigned ? (
        <>
          <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/qr')} style={styles.qrbutton}>
              <View style={[styles.view1]}>
                <Image style={styles.image} source={require('@/assets/icons/images.png')} />
                <Text style={[styles.scanQRtext, { fontFamily: 'Raleway_700Bold' }]}>
                  Scan QR Code
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <View style={[styles.view2]}>
            <TouchableOpacity
              onPress={() => router.push('/(routes)/addVehicle')}
              style={styles.addvehiclebutton}
            >
              <Text style={[styles.addVehicletext, { fontFamily: 'Raleway_700Bold' }]}>
                +Add Vehicle
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.parkedVehicles, { fontFamily: 'Raleway_700Bold' }]}>
            Parked Vehicles
          </Text>
          <SearchInput
            homeScreen={true}
            value={searchQuery}
            onChangeText={handleSearch} // Update search query dynamically
          />

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.container}>
                {filteredVehicles?.length > 0 ? (
                  filteredVehicles.map((vehicle, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        router.push({
                          pathname: '/(routes)/viewParkedVehicle',
                          params: { vehicle: JSON.stringify(vehicle) },
                        })
                      }
                      style={styles.vehicleTemplateBtn}
                    >
                      <View style={styles.vehicleBox}>
                        <View style={styles.textContainer}>
                          <Text style={styles.vehicleNumber}>{vehicle.vehicle_number}</Text>
                          <Text style={styles.vehicleType}>{vehicle.vehicle_type_name}</Text>
                        </View>
                        <Image
                          style={styles.vehicleIcon}
                          source={
                            vehicle.vehicle_type_name === 'Car'
                              ? require('@/assets/icons/car.png')
                              : vehicle.vehicle_type_name === 'Bike'
                              ? require('@/assets/icons/bike.png')
                              : vehicle.vehicle_type_name === 'Large Vehicle'
                              ? require('@/assets/icons/largeVehicle.png')
                              : vehicle.vehicle_type_name === 'Threewheeler'
                              ? require('@/assets/icons/tuk-tuk.png')
                              : require('@/assets/icons/bike.png')
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noVehiclesText}>No parked vehicles found.</Text>
                )}
              </View>
            </ScrollView>
          )}
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: colors.primary, textAlign: 'center' }}>
            You are not assigned to a parking lot.
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  qrbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 20,
    marginTop:8,
    marginBottom:8,
    paddingBottom: 2,
    paddingTop: 2,
    borderWidth: 3,
    borderColor: 'rgba(213, 205, 205, 1)',
    borderStyle: 'solid',
  },
  view1: {
    flexDirection: "row",
    alignItems: 'center',
  },
  image: {
    height: 40,
    width: 40,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  scanQRtext: {
    color: "rgba(26, 33, 49, 0.6)",
    fontSize: 30,
  },
  view2: {
    width: "100%",
    flexDirection: "column",
    alignItems: 'center',
  },
  addvehiclebutton: {
    backgroundColor: "rgba(26, 33, 49, 1)",
    borderRadius: 14,
    paddingBottom: 6,
    paddingTop: 3,
    paddingLeft: 25,
    paddingRight: 25,
  },
  addVehicletext: {
    fontSize: 20,
    color: "white",
  },
  parkedVehicles: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 20,
    color: "rgba(26, 33, 49, 1)",
    marginBottom: 10,
  },
  container: {
    padding: 20,
    paddingTop:10,
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
  vehicleTemplateBtn: {},
  noVehiclesText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 18,
    marginTop: 20,
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
    marginTop: 20,
  },
});

export default HomeScreen;
