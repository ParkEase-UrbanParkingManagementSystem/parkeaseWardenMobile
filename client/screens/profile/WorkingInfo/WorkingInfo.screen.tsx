import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput ,ScrollView} from "react-native";
import { useFonts, Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_500Medium, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { useFocusEffect } from "expo-router";
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

type ParkingLotDetails = {
  parking_lot_name: string;
  // parking_lot_location: string | null;
  bike_capacity: number;
  tw_capacity: number;
  car_capacity: number;
  xlvehicle_capacity: number;
  full_capacity: number | null;
  lot_addressno: string;
  lot_street1: string;
  lot_street2: string;
  lot_city: string;
  lot_district: string;
  lot_description: string;
};

type WorkingInfoType = {
  pmc_name: string;
  parking_lot_details: ParkingLotDetails;
};


export default function WorkingInfo() {
  const [workingInfo, setWorkingInfo] = useState<WorkingInfoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  const fetchWorkingInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const response = await axios.get(`${BASE_URL}/fetchWorkingInfo`, {
        params: { user_id },
      });
      setWorkingInfo(response.data);
      console.log('Fetched working info:', response.data);
    } catch (error) {
      console.error('Error fetching data for workinginfooo:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWorkingInfo();
    }, [fetchWorkingInfo])
  );

  if (!fontsLoaded || fontError) {
    return null;
  }
  const fullAddress = `${workingInfo?.parking_lot_details.lot_addressno || ''}, ${workingInfo?.parking_lot_details.lot_street1 || ''}, ${workingInfo?.parking_lot_details.lot_street2 || ''}, ${workingInfo?.parking_lot_details.lot_city || ''}, ${workingInfo?.parking_lot_details.lot_district || ''}`;


  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>WardenId</Text>
        <TextInput style={styles.input} value="01" />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>PMC Name</Text>
        <TextInput style={styles.input} value={workingInfo?.pmc_name || ''} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Assigned Lot Name</Text>
        <TextInput style={styles.input} value={workingInfo?.parking_lot_details.parking_lot_name || ''} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Lot Address</Text>
        <TextInput style={styles.input} value={fullAddress} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bike Capacity</Text>
        <TextInput style={styles.input} value={workingInfo?.parking_lot_details.bike_capacity?.toString() || ''} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>car Capacity</Text>
        <TextInput style={styles.input} value={workingInfo?.parking_lot_details.car_capacity?.toString() || ''} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Xlvehicle Capacity</Text>
        <TextInput style={styles.input} value={workingInfo?.parking_lot_details.xlvehicle_capacity?.toString() || ''} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tw Capacity</Text>
        <TextInput style={styles.input} value={workingInfo?.parking_lot_details.tw_capacity?.toString() || ''} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Capacity</Text>
        <TextInput style={styles.input} value={workingInfo?.parking_lot_details.full_capacity?.toString() || ''} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Commission Rate</Text>
        <TextInput style={styles.input} value="12%" />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Working Hours</Text>
        <TextInput style={styles.input} value="09:00 am - 08:00 pm" />
      </View>
      {/* <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Update Information</Text>
      </TouchableOpacity> */}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Nunito_500Medium',
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  updateButton: {
    backgroundColor: "rgba(26, 33, 49, 1)",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'Raleway_700Bold',
  },
});
