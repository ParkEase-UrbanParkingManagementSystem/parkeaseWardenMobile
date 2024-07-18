import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal } from "react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";


export default function Header() {
  const [modalVisible, setModalVisible] = useState(false);
  const [carSlots, setCarSlots] = useState(300);
  const [bikeSlots, setBikeSlots] = useState(100);

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
            Saman!
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
                onChangeText={(text) => setCarSlots(parseInt(text))}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bike Slots</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={bikeSlots.toString()}
                onChangeText={(text) => setBikeSlots(parseInt(text))}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}>
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
    paddingTop: 70,
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
