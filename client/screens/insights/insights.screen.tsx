import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { Card } from 'react-native-paper';
import Header2 from "@/components/header3/header2";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/Colors";
import SearchInput from "@/components/common/search.input";
import RNPickerSelect from 'react-native-picker-select';

export default function InsightsScreen() {
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
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Parking Area</Text>
            <Text style={styles.cardContent}>K Zone</Text>
            <Text style={styles.date}>21/02/2023</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Rates Per Hour</Text>
            <View style={styles.row}>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/carIcon.png')} />
              <Text style={styles.cardContent}>100</Text>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/bikeIcon.png')} />
              <Text style={styles.cardContent}>50</Text>
            </View>
          </Card>
        </View>
  
        <View style={styles.row}>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Total Slots</Text>
            <View style={styles.row}>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/carIcon.png')} />
              <Text style={styles.cardContent}>100</Text>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/bikeIcon.png')} />
              <Text style={styles.cardContent}>50</Text>
            </View>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Available Slots</Text>
            <View style={styles.row}>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/carIcon.png')} />
              <Text style={styles.cardContent}>300</Text>
              <Image style={styles.icon38} source={require('@/assets/iconsInsightScreen/bikeIcon.png')} />
              <Text style={styles.cardContent}>100</Text>
            </View>
          </Card>
        </View>
  
        <Text style={styles.subHeader}>Daily Revenue</Text>
  
        <View style={styles.row}>
          <Card style={styles.revenueCard}>
            <Text style={styles.revenueAmount}>3000 LKR</Text>
            <Text style={styles.revenueType}>Cash</Text>
          </Card>
          <Card style={styles.revenueCard}>
            <Text style={styles.revenueAmount}>1000 LKR</Text>
            <Text style={styles.revenueType}>Card</Text>
          </Card>
          <Card style={styles.revenueCard}>
            <Text style={styles.revenueAmount}>500 LKR</Text>
            <Text style={styles.revenueType}>Commission</Text>
          </Card>
        </View>
        <View style={styles.row1}>
          <Text style={styles.totalIncome}>Today Total Income</Text>
          <Text style={styles.totalAmount}>Rs. 4000</Text>
        </View>
        <Text style={styles.subHeader}>Monthly Revenue</Text>
        
        <Card style={styles.monthlyCard}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.month}>Month</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedMonth(value)}
              items={months}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select a month', value: null }}
            />
          </View>
          {selectedMonth ? (
            <Text style={styles.monthlyRevenue}>
              Warden Commission for {selectedMonth} 10000 LKR
            </Text>
          ) : null}
        </Card>
      </ScrollView>
    </LinearGradient>
  )
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

  card: {
    width: '48%',
    padding: 10,
    backgroundColor:'rgba(26, 33, 49, 1)',
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'white'
  },
  cardContent: {
    fontSize: 24,
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

