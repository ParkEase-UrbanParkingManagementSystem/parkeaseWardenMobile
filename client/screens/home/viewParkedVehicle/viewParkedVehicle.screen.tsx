import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Modal, TouchableHighlight } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import colors from "../../../constants/Colors";
// import { format } from 'date-fns';

export default function ViewParkedVehicleScreen() {
  const { vehicle } = useLocalSearchParams();
  const parsedVehicle = vehicle && typeof vehicle === 'string' ? JSON.parse(vehicle) : null;

  const [fontsLoaded] = useFonts({
    Raleway_700Bold,
  });

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Effect logic can go here if needed
  }, []); // Ensure empty dependency array if no dependencies

  if (!fontsLoaded || !parsedVehicle) {
    return null; // Return loading indicator or null if fonts are not loaded or vehicle data is not available
  }

  // const handleExitConfirm = () => {
  //   console.log("Exiting vehicle confirmed");
  //   setModalVisible(false);
  //   const currentTime = new Date().toISOString(); // Get the current time as ISO string
  //   router.push({
  //     pathname: "/(routes)/checkout",
  //     params: { 
  //       vehicle: JSON.stringify({ 
  //         ...parsedVehicle, 
  //         outTime: currentTime // Add the current time as out time 
  //       }) 
  //     },
  //   });
  //   // Implement your exit vehicle logic here
  // };


  const handleExitConfirm = () => {
    console.log("Exiting vehicle confirmed");

    // Get the current time as ISO string
    // const currentTime = new Date().toISOString();
    // Get the current time as a Date object
    const currentTime1 = new Date();
    const currentTime = currentTime1.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: true });
    // Format the current time as 'hh:mm a'
    // const currentTime = format(currentTime1, 'hh:mm a');
    
    // Create the object with updated vehicle data
    const updatedVehicleData = {
        ...parsedVehicle,
        outTime: currentTime // Add the current time as out time
    };

    // Log the updated vehicle data to ensure correctness
    console.log('Updated Vehicle Data:', updatedVehicleData);

    // Validate the updated vehicle data (optional but recommended)
    const isValid = validateVehicleData(updatedVehicleData);
    if (!isValid) {
        console.error('Invalid vehicle data, cannot navigate to CheckoutScreen');
        return;
    }

    // Close the modal
    setModalVisible(false);

    // Navigate to CheckoutScreen with the updated vehicle data
    router.push({
        pathname: "/(routes)/checkout",
        params: {
          vehicle: JSON.stringify(updatedVehicleData)
        },
    });
};

// Basic validation function for vehicle data
const validateVehicleData = (data: { number: any; parkingId: any; driverId: any; outTime: any; }) => {
    return data && data.number && data.parkingId && data.driverId && data.outTime;
};






  const handleExitCancel = () => {
    console.log("Exiting vehicle canceled");
    setModalVisible(false);
    // Implement cancel logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.vehicleImage}
          source={parsedVehicle.type === 'bike' ? require('@/assets/icons/bike.png') : require('@/assets/icons/car.png')}
        />
        <Text style={[styles.vehicleNumber, { fontFamily: "Raleway_700Bold" }]}>{parsedVehicle.number}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{parsedVehicle.parkingZone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Type of Vehicle</Text>
          <Text style={styles.value}>{parsedVehicle.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>In Time</Text>
          <Text style={[styles.value, styles.highlight]}>{parsedVehicle.parkedTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{parsedVehicle.Date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Parking ID</Text>
          <Text style={styles.value}>{parsedVehicle.parkingId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Driver ID</Text>
          <Text style={styles.value}>{parsedVehicle.driverId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Slots Allocated</Text>
          <Text style={styles.value}>{parsedVehicle.slotsAllocated}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Warden ID</Text>
          <Text style={styles.value}>{parsedVehicle.wardenId}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    elevation: 2,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
