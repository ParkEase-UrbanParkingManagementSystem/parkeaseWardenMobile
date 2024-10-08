//viewParkedVehicleScreen.tsx both qr and home
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Modal, TouchableHighlight } from "react-native";
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import colors from "../../../constants/Colors";
import { useRoute } from '@react-navigation/native';

export default function ViewParkedVehicleScreen() {
  const route = useRoute();
  const params = useLocalSearchParams();

  // Prioritize vehicle over params.data
  const vehicleData = typeof params.vehicle === 'string' ? JSON.parse(params.vehicle) : null;
  const data = typeof params.data === 'string' ? JSON.parse(params.data) : null;

  // Use vehicleData if available, otherwise use data
  const parsedData = vehicleData || data;

  console.log('Parsed Data:', parsedData);

  const [fontsLoaded] = useFonts({
    Raleway_700Bold,
  });

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (parsedData) {
      console.log('Vehicle data:', parsedData);
    }
  }, [parsedData]);

  if (!fontsLoaded || !parsedData) {
    return null; // Return loading indicator or null if fonts are not loaded or vehicle data is not available
  }

  const handleExitConfirm = () => {
    console.log("Exiting vehicle confirmed");

    const currentTime1 = new Date();
    const currentTime = currentTime1.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const updatedVehicleData = {
        ...parsedData,
        outTime: currentTime
    };

    console.log('Updated Vehicle Data:', updatedVehicleData);

    const isValid = validateVehicleData(updatedVehicleData);
    if (!isValid) {
        console.error('Invalid vehicle data, cannot navigate to CheckoutScreen');
        return;
    }

    setModalVisible(false);

    router.push({
        pathname: "/(routes)/checkout",
        params: {
          vehicle: JSON.stringify(updatedVehicleData)
        },
    });
  };

  const validateVehicleData = (data: { vehicle_number: any; parking_lot_name: any; driver_name: any; outTime: any; }) => {
    return data &&
      data.vehicle_number &&
      data.parking_lot_name &&
      data.driver_name &&
      data.outTime;
  };

  const handleExitCancel = () => {
    console.log("Exiting vehicle canceled");
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.vehicleImage}
          source={
            parsedData.vehicle_type_name === 'Car'
                      ? require('@/assets/icons/car.png')
                      : parsedData.vehicle_type_name === 'Bike'
                      ? require('@/assets/icons/bike.png')
                      : parsedData.vehicle_type_name === 'Large Vehicle'
                      ? require('@/assets/icons/largeVehicle.png')
                      : parsedData.vehicle_type_name === 'Threewheeler'
                      ? require('@/assets/icons/tuk-tuk.png')
                      : require('@/assets/icons/bike.png')
          }
        />
        <Text style={[styles.vehicleNumber, { fontFamily: "Raleway_700Bold" }]}>{parsedData.vehicle_number}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{parsedData.parking_lot_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Vehicle Type</Text>
          <Text style={styles.value}>{parsedData.vehicle_type_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>In Time</Text>
          <Text style={[styles.value, styles.highlight]}>{new Date(parsedData.in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{new Date(parsedData.in_time).toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Driver Name</Text>
          <Text style={styles.value}>{parsedData.driver_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Slots Allocated</Text>
          <Text style={styles.value}>{parsedData.slotsAllocated}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Warden Name</Text>
          <Text style={styles.value}>{parsedData.warden_name}</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.holdButton]}>
          <Text style={styles.buttonText}>Hold</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.exitButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Exit Vehicle</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for exit confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to exit this vehicle?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: "#FFA500" }}
                onPress={handleExitConfirm}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: "#333" }}
                onPress={handleExitCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      {/* End of Modal */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  vehicleImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  vehicleNumber: {
    fontSize: 24,
    color: '#333',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  highlight: {
    color: '#FFA500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  holdButton: {
    backgroundColor: '#FFA500',
  },
  exitButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  modalButtonsContainer: {
    flexDirection: "row",
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
