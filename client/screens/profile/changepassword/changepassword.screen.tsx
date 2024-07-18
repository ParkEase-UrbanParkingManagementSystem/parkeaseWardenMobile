import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useFonts, Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_500Medium, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient'; // Make sure you have installed 'expo-linear-gradient'

export default function ChangePassword() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.editPw}>
      <Text style={styles.yourPasswordMust}>
        Your password must be at least 8 characters long, and contain at least one digit and one non-digit character
      </Text>
      <View style={styles.inputFields}>
        <View style={styles.fieldTypes}>
          <View style={styles.textFieldLabelActive}>
            <View style={styles.textFieldLabelDefault}>
              <Text style={styles.label}>Old Password</Text>
              <View style={styles.textFieldDefault}>
                <TextInput
                  style={styles.content}
                  placeholder="***************"
                  secureTextEntry={!oldPasswordVisible}
                />
                <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)}>
                  <Ionicons
                    name={oldPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#747474"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.fieldTypes}>
          <View style={styles.textFieldLabelActive}>
            <View style={styles.textFieldLabelDefault}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.textFieldDefault}>
                <TextInput
                  style={styles.content}
                  placeholder="*****************"
                  secureTextEntry={!newPasswordVisible}
                />
                <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
                  <Ionicons
                    name={newPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#747474"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.fieldTypes}>
          <View style={styles.textFieldLabelActive}>
            <View style={styles.textFieldLabelDefault}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.textFieldDefault}>
                <TextInput
                  style={styles.content}
                  placeholder="*****************"
                  secureTextEntry={!confirmPasswordVisible}
                />
                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  <Ionicons
                    name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#747474"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.updatePasswordButton}>
        <LinearGradient
          colors={['#000428', '#004e92']} // Example gradient colors
          style={styles.updatePasswordGradient}
        >
          <Text style={[styles.updatePasswordText, { fontFamily: "Raleway_700Bold" }]}>Update Password</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  editPw: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    padding: 20,
    paddingTop: 70,
  },
  yourPasswordMust: {
    marginBottom: 70,
    textAlign: 'center',
    color: '#000',
  },
  inputFields: {
    width: '100%',
    marginBottom: 20,
  },
  fieldTypes: {
    marginBottom: 15,
  },
  textFieldLabelActive: {
    width: '100%',
  },
  textFieldLabelDefault: {
    marginBottom: 5,
  },
  label: {
    color: '#000',
    marginBottom: 5,
  },
  textFieldDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 5,
    padding: 10,
  },
  content: {
    flex: 1,
    color: '#000',
  },
  updatePasswordButton: {
    borderRadius: 14,
    alignItems: 'center',
  },
  updatePasswordGradient: {
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updatePasswordText: {
    fontSize: 18,
    color: '#FFF',
  },
});
