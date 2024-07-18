import { StyleSheet, Text, View ,TouchableOpacity,Image,ScrollView} from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/Colors"
import Header from "@/components/header/header";
import { router } from "expo-router";
import SearchInput from "@/components/common/search.input";
import VehicleTemplate from "@/components/vehicleTemplate/vehicleTemplate";



import React from 'react'

export default function HomeScreen() {
  return (
    <LinearGradient 
        colors={[colors.background,"white"]}
        style={{ flex: 1, paddingTop: 0}}
    >
      <Header />

      <TouchableOpacity onPress={() => router.push("/(tabs)/qr")} style={styles.qrbutton}>
        <View style={[styles.view1]}>
          <Image
            style={styles.image}
            source={require("@/assets/icons/images.png")}
          />
          <Text style={[styles.scanQRtext, { fontFamily: "Raleway_700Bold" }]}>
            Scan QR Code
          </Text>
        </View>
      </TouchableOpacity>

      <View style={[styles.view2]}>
        <TouchableOpacity onPress={() => router.push("/(routes)/addVehicle")} style={styles.addvehiclebutton}>
          <Text style={[styles.addVehicletext, { fontFamily: "Raleway_700Bold" }]}>
              +Add Vehicle
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.parkedVehicles, { fontFamily: "Raleway_700Bold" }]}>
        Parked Vehicles
      </Text>

      <SearchInput homeScreen={true} />
      <ScrollView showsVerticalScrollIndicator={false}>


        <VehicleTemplate/>
      </ScrollView>


    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  qrbutton :{
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    // backgroundColor: 'yellow',
    padding: 10, // Add some padding for better touch area
    borderRadius: 10, // Optional: add some border radius
    margin: 20,
    paddingBottom: 2,
    paddingTop: 2,
    borderWidth: 3, // Border width
    borderColor: 'rgba(213, 205, 205, 1)', // Border color
    borderStyle: 'solid', // Border style  
  },

  view1:{
    flexDirection: "row",
    alignItems: 'center',
  },

  image:{
    height:80,
    width:80,
    marginTop:5,
    marginBottom:5,
    marginRight:7,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // Shadow for Android
    elevation: 5,
  },

  scanQRtext:{
    color: "rgba(26, 33, 49, 0.6)",
    fontSize: 30,
  },

  view2:{
    width:"100%",
    flexDirection: "column",
    alignItems: 'center',
  },

  addvehiclebutton:{
    backgroundColor:"rgba(26, 33, 49, 1)",
    borderRadius:14,
    paddingBottom:8,
    paddingTop:5,
    paddingLeft:25,
    paddingRight:25,
  },

  addVehicletext:{
    fontSize:25,
    color:"white",
  },

  parkedVehicles:{
    marginTop:20,
    marginLeft:20,
    fontSize:25,
    color:"rgba(26, 33, 49, 1)",
    marginBottom:20,
  },

})