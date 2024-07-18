import { View, Text, StyleSheet } from "react-native";
// import React from 'react'
import { router } from "expo-router";
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";

export default function Header2() {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={[styles.title, { fontFamily: "Raleway_700Bold" }]}>
          History
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#1A2131",
    marginLeft: 0,
    paddingTop: 70,
    // paddingLeft: 30,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
});
