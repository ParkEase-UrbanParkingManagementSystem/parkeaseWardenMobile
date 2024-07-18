import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import { useFonts, Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_500Medium, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import RadioForm from 'react-native-simple-radio-button';

export default function VehicleForm() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  const [number, setNumber] = useState("");
  const [vehicleType, setVehicleType] = useState(-1);
  const [inTime, setInTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [wardenId, setWardenId] = useState("1");
  const [slotType, setSlotType] = useState(-1);
  const [numberOfSlots, setNumberOfSlots] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    setDate(currentDate.toLocaleDateString());
    setInTime(currentDate.toLocaleTimeString());
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const vehicleTypes = [
    { label: "Car", value: 0 },
    { label: "Bike", value: 1 },
    { label: "Lorry", value: 2 }
  ];
  
  const slotTypes = [
    { label: "Car", value: 0 },
    { label: "Bike", value: 1 }
  ];
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Vehicle Number</Text>
        <TextInput
          style={styles.input}
          value={number}
          onChangeText={setNumber}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Vehicle Type</Text>
        <RadioForm
          radio_props={vehicleTypes}
          initial={-1}
          onPress={(value) => setVehicleType(value)}
          formHorizontal={true}
          labelHorizontal={false}
          buttonColor={'#000'}
          animation={true}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Slot Type</Text>
        <RadioForm
          radio_props={slotTypes}
          initial={-1}
          onPress={(value) => setSlotType(value)}
          formHorizontal={true}
          labelHorizontal={false}
          buttonColor={'#000'}
          animation={true}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of slots</Text>
        <TextInput
          style={styles.input}
          value={numberOfSlots}
          onChangeText={setNumberOfSlots}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>In time</Text>
        <TextInput
          style={styles.input}
          value={inTime}
          editable={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          editable={false}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Warden Id</Text>
        <TextInput
          style={styles.input}
          value={wardenId}
          editable={false}
        />
      </View>
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
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
  radioLabel: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Nunito_400Regular',
  },
  confirmButton: {
    backgroundColor: "rgba(26, 33, 49, 1)",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'Raleway_700Bold',
  },
});
