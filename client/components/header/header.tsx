import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal } from "react-native";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../config'; // Adjust the import path based on your file structure


export default function Header() {
  const [modalVisible, setModalVisible] = useState(false);
  const [carSlots, setCarSlots] = useState(300);
  const [bikeSlots, setBikeSlots] = useState(100);
  const [wardenName, setWardenName] = useState('');
  const [error, setError] = useState<string | null>(null);


  // useEffect(() => {
    const fetchWardenName = async () => {
      try {
        console.log('Fetching user_id from AsyncStorage');
        const user_id = await AsyncStorage.getItem('user_id');
        console.log('Retrieved user_id:', user_id);

        if (user_id) {
          console.log('Making API call to fetch warden name');
          // const response = await axios.get(`http://192.168.238.186:5003/get-warden-name/${user_id}`);
          const response = await axios.get(`${BASE_URL}/get-warden-name/${user_id}`);

          console.log('API response:', response.data);

          setWardenName(response.data.wardenName);
          console.log('Warden name set in state:', response.data.wardenName);
        } else {
          console.log('No user_id found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching warden name:', error);
      }
    };

    const fetchAvailableSlots = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        const response = await axios.get(`${BASE_URL}/fetch_available_slots`, {
          params: { user_id },
        });
        console.log('Available slotsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss:', response.data);
  
        setBikeSlots(response.data.bike_capacity_available);
        setCarSlots(response.data.car_capacity_available);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setError('Error fetching available slots');
      }
    };


    const handleConfirm = async () => {
      try{
        const user_id = await AsyncStorage.getItem('user_id');
        const response = await axios.post(`${BASE_URL}/update_slots`, {
          user_id,
          carSlots: carSlots,
          bikeSlots: bikeSlots,
        });
        console.log('Updated slots:', response.data);
        setModalVisible(false);
        // router.push('/(tabs)/home');

      }catch(error){  
        console.error('Error updating slots:', error);
        setError('Error updating slots');
      }
    };

    // fetchWardenName();
  // }, []);
useFocusEffect(
  useCallback(() => { 
    fetchWardenName();
    fetchAvailableSlots(); // Fetch available slots when screen is focused
  }, [])
);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <Image style={styles.image} source={require("@/assets/icons/man.png")} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.helloText, { fontFamily: "Raleway_700Bold" }]}>
            Hello,
          </Text>
          <Text style={[styles.text, { fontFamily: "Raleway_700Bold" }]}>
            {wardenName ? wardenName : 'Loading...'}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.availableSlotsButton}>
        <View style={styles.availableSlotsView}>
          <Text style={styles.availableSlotsText}>Available Slots</Text>
          <Text style={styles.slotsText}>🚗   {carSlots}</Text>
          <Text style={styles.slotsText}>🏍️   {bikeSlots}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
        <LinearGradient
            colors={['#D3D3D3', '#A9A9A9']} // Adjust gradient colors as needed
            style={styles.modalView}
        >
          {/* <View style={styles.modalView}> */}
            <Text style={styles.modalText}>Edit Number of Slots</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Car Slots</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={carSlots.toString()}
                onChangeText={(text) => 
                  // setCarSlots(parseInt(text))}
                  {
                    const parsedValue = text? parseInt(text): 0;
                    if(!isNaN(parsedValue)){
                      setCarSlots(parsedValue);
                    } else {
                      setCarSlots(0);
                    }
                  }}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bike Slots</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={bikeSlots.toString()}
                onChangeText={(text) => 
                  // setBikeSlots(parseInt(text))}
                  {
                    // Validate and parse the text input
                    const parsedValue = text ? parseInt(text, 10) : 0;
                    // Check if parsed value is a valid number
                    if (!isNaN(parsedValue)) {
                      setBikeSlots(parsedValue);
                    } else {
                      // Handle invalid input if needed
                      setBikeSlots(0); // or some default value
                    }
                  }}

              />
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              // onPress={() => setModalVisible(false)}>
              onPress={handleConfirm} // Call handleConfirm when "CONFIRM" is pressed
              >
              <Text style={styles.textStyle}>CONFIRM</Text>
            </TouchableOpacity>
          {/* </View> */}
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#1A2131",
    marginLeft: 0,
    paddingTop: 45,
    paddingLeft: 30,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 45,
    height: 45,
    marginRight: 8,
    borderRadius: 100,
  },
  text: {
    fontSize: 12,
    color: "white",
  },
  helloText: { color: "white", fontSize: 14 },

  availableSlotsButton: {
    marginRight: 20,
    padding: 10,
    borderRadius: 10,
    // backgroundColor: 'white',
    backgroundColor: "#1A2131",
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",

  },
  availableSlotsView: {
    flexDirection: "column",
    alignItems: "center",
    
  },
  availableSlotsText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  slotsText: {
    fontSize: 18,
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -280,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    // margin: 20,
    marginLeft: 60,
    // backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingBottom: 20,
    paddingTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    // backgroundColor: "#2196F3",
    backgroundColor: "rgba(229, 228, 228, 0.67)",
    paddingLeft: 20,
    paddingRight: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    // color: "black",
    marginRight: 10,
    color: "white",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    paddingLeft: 10,
    flex: 1,
    textAlign: "center",
    borderRadius: 10,
    color: "white",
    fontWeight: "bold",
  },
});