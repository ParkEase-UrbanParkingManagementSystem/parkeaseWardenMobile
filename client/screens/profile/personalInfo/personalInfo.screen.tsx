import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import { useFonts, Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_500Medium, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito";

export default function PersonalInfo() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [contactNumber, setContactNumber] = useState("01115927927");
  const [address, setAddress] = useState("No 25/1 kadalana");

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleEditButtonClick = () => {
    setIsEditing(true);
    setIsEditable(true);
  };

  const handleSaveButtonClick = () => {
    setIsEditing(false);
    setIsEditable(false);
  };

  const handleCancelButtonClick = () => {
    setIsEditing(false);
    setIsEditable(false);
    // Optionally, you can reset the state to the initial values if needed.
    setContactNumber("01115927927");
    setAddress("No 25/1 kadalana");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} value="Saman" editable={false} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} value="Kumara" editable={false} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>NIC</Text>
        <TextInput style={styles.input} value="1235 6478 990" editable={false} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender</Text>
        <TextInput style={styles.input} value="Male" editable={false} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Birth Date</Text>
        <TextInput style={styles.input} value="1235 6478 990" editable={false} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          value={contactNumber}
          onChangeText={setContactNumber}
          editable={isEditable}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          editable={isEditable}
        />
      </View>

      {isEditing ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveButtonClick}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelButtonClick}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={handleEditButtonClick}>
          <Text style={styles.buttonText}>Edit Information</Text>
        </TouchableOpacity>
      )}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "rgba(26, 33, 49, 1)",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "rgba(26, 33, 49, 1)",
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: "#B22222",
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'Raleway_700Bold',
  },
});
