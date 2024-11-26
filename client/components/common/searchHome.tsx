import {
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Text,
    Image,
  } from "react-native";
  import { useFonts, Nunito_700Bold } from "@expo-google-fonts/nunito";
  import { AntDesign, Ionicons } from "@expo/vector-icons";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { SERVER_URI } from "@/utils/uri";
  import { router } from "expo-router";
  // import CourseCard from "../cards/course.card";
  import { widthPercentageToDP } from "react-native-responsive-screen";
  
  export default function SearchInput({
    homeScreen,
    value,
    onChangeText,
  }: {
    homeScreen?: boolean;
    value: string;
    onChangeText: (text: string) => void;
  }) {
    return (
      <View>
        <View style={styles.filteringContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.input, { fontFamily: "Nunito_700Bold" }]}
              placeholder={homeScreen ? "Search on Home Screen" : "Search"}
              value={value}
              onChangeText={onChangeText}
              placeholderTextColor={"#C67cc"}
            />
            <TouchableOpacity
              style={styles.searchIconContainer}
              onPress={() => onChangeText(value)} // Trigger search on icon press
            >
              <AntDesign name="search1" size={20} color={"#fff"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  
  
  export const styles = StyleSheet.create({
    filteringContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 16,
      borderWidth: 3, // Border width
      borderColor: 'rgba(213, 205, 205, 1)', // Border color
      borderStyle: 'solid', // Border style  
    },
  
    searchContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 5,
      paddingHorizontal: 10,
      // marginRight: 10,
    },
  
    searchIconContainer: {
      width: 36,
      height: 36,
      backgroundColor: "rgba(26, 33, 49, 1)",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
    },
  
    input: {
      flex: 1,
      fontSize: 14,
      color: "black",
      paddingVertical: 10,
      width: 271,
      height: 40,
    },
  });
