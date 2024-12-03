import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { Card } from 'react-native-paper';
import Header2 from "@/components/header3/header2";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/Colors";
import SearchInput from "@/components/common/search.input";
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';
import axios from 'axios';

export default function InsightsScreen() {
  const [totalSlots, setTotalSlots] = useState(0); // To store the total parking slots
  const [availableSlots, setAvailableSlots] = useState({ car: 0, bike: 0 }); // To store available slots for cars and bikes
  const [ratesPerHour, setRatesPerHour] = useState({ car: 0, bike: 0 }); // To store parking rates per vehicleffdd
  const [totalRevenue, setTotalRevenue] = useState(0); // To store the total revenue generated
  const [paymentMethodsIncome, setPaymentMethodsIncome] = useState({ cash: 0, card: 0, commission: 0 }); // To store the total revenue generated
  const[name, setName] = useState(''); // To store the name of the parking area
  const [loading, setLoading] = useState(false); // To track the loading state
  const [error, setError] = useState(''); // To store any error messages

  // Fetch parking details when the component mounts
  useEffect(() => {
    fetchParkingDetails();
  }, []);

  const fetchParkingDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const user_id = await AsyncStorage.getItem("user_id");

      // Make the API call to fetch parking details
      const response = await axios.get(`${BASE_URL}/fetch_parking_details`, {
        params: { user_id },
      });

      // Destructure the response data to get the parking details
      const { total_slots, available_slots, rates_per_hour, total_income, payment_methods_income, lot_name } = response.data;

      // Update your state variables with the response data
      setTotalSlots(total_slots); // Total parking slots
      setAvailableSlots(available_slots); // Available parking slots for cars and bikes
      setRatesPerHour(rates_per_hour); // Parking rates per vehicle
      setTotalRevenue(total_income); // Total revenue generatedk
      setPaymentMethodsIncome(payment_methods_income); // Total revenue generatedk
      setName(lot_name);


      console.log("Parking details fetched successfully:", response.data);

      console.log("Total Slots:", total_slots);
      console.log("Available Slots:", available_slots);
      console.log("Rates Per Hour:", rates_per_hour);
      console.log("Total Revenue:", total_income);
      console.log("Payment Methods Income:", payment_methods_income);

    } catch (error) {
      console.error("Error fetching parking details:", error);
      setError("Error fetching parking details");
    } finally {
      setLoading(false);
    }
  };
  

  const [selectedMonth, setSelectedMonth] = useState('');

  const months = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];

  return (
    <LinearGradient
      colors={[colors.background, "white"]}
      style={{ flex: 1, paddingTop: 0 }}
    >
      <Header2 />

      <ScrollView style={styles.container}>
        <Text style={styles.header}>Overview</Text>

        <View style={styles.row}>
          <Card style={styles.cardEx}>
            <Text style={styles.cardTitle2}>Parking Area</Text>
            <Text style={styles.cardContentTitle}>{name}</Text>
            <Text style={styles.date}>03/12/2024</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Rates Per Hour</Text>
            <View style={styles.row2}>

            <View style={styles.rowEx2}>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/carIcon.png')} />
              <Text style={styles.cardContent2}>{ratesPerHour.car}/=</Text>
              </View>
              

              <View style={styles.rowEx2}>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/bikeIcon.png')} />
              <Text style={styles.cardContent2}>{ratesPerHour.bike}/=</Text>
              </View>


            </View>
          </Card>
        </View>

        <View style={styles.row}>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Total Slots</Text>
            <View style={styles.row}>
              <View style={styles.rowEx}>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/carIcon.png')} />
              <Text style={styles.cardContent}>{totalSlots?.car}</Text>

              </View>

              <View style={styles.rowEx}>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/bikeIcon.png')} />
              <Text style={styles.cardContent}>{totalSlots?.bike}</Text>
                </View>
            </View>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Available Slots</Text>
            <View style={styles.row}>

            <View style={styles.rowEx}>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/carIcon.png')} />
              <Text style={styles.cardContent}>{availableSlots?.car}</Text>
              </View>
              <View style={styles.rowEx}>  
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/bikeIcon.png')} />
              <Text style={styles.cardContent}>{availableSlots?.bike}</Text>
            
              </View></View>
          </Card>
        </View>

        <Text style={styles.subHeader}>Daily Revenue</Text>

        <View style={styles.row}>
          <Card style={styles.revenueCard}>
            <Text style={styles.revenueAmount}>{paymentMethodsIncome?.cash}/=</Text>
            <Text style={styles.revenueType}>Cash</Text>
          </Card>
          <Card style={styles.revenueCard}>
            <Text style={styles.revenueAmount}>{paymentMethodsIncome?.wallet}/=</Text>
            <Text style={styles.revenueType}>Wallet</Text>
          </Card>
          <Card style={styles.revenueCard}>
            <Text style={styles.revenueAmount}>{paymentMethodsIncome?.parkpoints}/=</Text>
            <Text style={styles.revenueType}>ParkPoints</Text>
          </Card>
        </View>

        <View style={styles.row1}>
          <Text style={styles.totalIncome}>Today Total Income</Text>
          <Text style={styles.totalAmount}>Rs. {totalRevenue}</Text>
        </View>

      

        
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  icon38: {
    width: 16,
    height: 16,
    position: 'relative',
    marginTop: 8,
    marginRight: -5,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    marginBottom: 0,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    marginTop: 20,
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    marginTop: 5,
  },

  rowEx: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 10,
    marginTop: 5,
  },

  rowEx2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    marginTop: 5,
  },


  row2: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 10,
    marginTop: 5,
  },

  card: {
    width: '48%',
    padding: 10,
    backgroundColor:'rgba(26, 33, 49, 1)',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },

  cardEx: {
    width: '48%',
    padding: 10,
    backgroundColor:'rgba(26, 33, 49, 1)',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',


  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color:'white',
    alignItems: 'center',
    justifyContent: 'center',

  },
  
  cardTitle2: {
    marginBottom: 25,
    fontSize: 20,
    fontWeight: 'bold',
    color:'white',
    alignItems: 'center',
    justifyContent: 'center',

  },

  cardContent: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'white'
  },

  cardContent2: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'white',
    marginLeft: 14,
    marginTop:5
  },


  cardContentTitle: {

    fontSize: 18,
    fontWeight: 'bold',
    color:'white'
  },
  
  date: {
    fontSize: 12,
    color: '#666',
  },
  revenueCard: {
    width: '30%',
    alignItems: 'center',
    padding: 10,
    backgroundColor:'rgba(26, 33, 49, 1)',
    borderRadius: 10,
  },
  revenueAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white'
  },
  revenueType: {
    fontSize: 14,
    color:'white',
  },
  row1: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    margin: 70,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 180, 3, 1)',
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },

  totalIncome: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    // margin: 10,
    marginBottom: 0,
    // marginTop: 20,
    // backgroundColor: 'rgba(255, 180, 3, 1)',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#666',
  },
  monthlyCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor:'rgba(185, 196, 217, 0.23)',
    marginTop: 10,
  },
  month: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  monthlyRevenue: {
    fontSize: 16,
    color: '#666',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 10,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

