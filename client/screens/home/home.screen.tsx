import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/Colors";
import Header from "@/components/header/header";
import { router, useFocusEffect } from "expo-router";
import SearchInput from "@/components/common/search.input";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

type Vehicle = {
  driver_vehicle_id: string;
  in_time: string;
  instance_id: string;
  lot_id: string;
  out_time: string | null;
  slot_id: string | null;
  toll_amount: number | null;
  transaction_id: string | null;
  warden_id: string;
  vehicle_number: string;
  vehicle_type_name: string;
  parking_lot_name: string;
  driver_name: string;
  warden_name: string;
};

const HomeScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const response = await axios.get('http://192.168.8.198:5003/fetch_parked_vehicles', {
        params: { user_id },
      });

      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <LinearGradient colors={[colors.background, "white"]} style={{ flex: 1, paddingTop: 0 }}>
      <Header />
      <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/qr")} style={styles.qrbutton}>
          <View style={[styles.view1]}>
            <Image style={styles.image} source={require("@/assets/icons/images.png")} />
            <Text style={[styles.scanQRtext, { fontFamily: "Raleway_700Bold" }]}>Scan QR Code</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
      <View style={[styles.view2]}>
        <TouchableOpacity onPress={() => router.push("/(routes)/addVehicle")} style={styles.addvehiclebutton}>
          <Text style={[styles.addVehicletext, { fontFamily: "Raleway_700Bold" }]}>+Add Vehicle</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.parkedVehicles, { fontFamily: "Raleway_700Bold" }]}>Parked Vehicles</Text>
      <SearchInput homeScreen={true} />
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push({ pathname: '/(routes)/viewParkedVehicle', params: { vehicle: JSON.stringify(vehicle) } })}
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
    height: 80,
    width: 80,
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
    paddingBottom: 8,
    paddingTop: 5,
    paddingLeft: 25,
    paddingRight: 25,
  },
  addVehicletext: {
    fontSize: 25,
    color: "white",
  },
  parkedVehicles: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 25,
    color: "rgba(26, 33, 49, 1)",
    marginBottom: 20,
  },
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
