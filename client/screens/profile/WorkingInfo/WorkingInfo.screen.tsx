import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useFonts, Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_500Medium, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito";

export default function WorkingInfo() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>WardenId</Text>
        <TextInput style={styles.input} value="01" />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>PMC</Text>
        <TextInput style={styles.input} value="Colombo Municipal Council" />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Assigned Area</Text>
        <TextInput style={styles.input} value="Wajira rd" />
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
