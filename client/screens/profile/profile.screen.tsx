import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import Header3 from "@/components/header3/header3";
import { router } from "expo-router";


export default function Settings() {
  return (
    <LinearGradient 
      colors={[colors.background,"white"]}
      style={{ flex: 1, paddingTop: 0 }}
    >
      <Header3 />

      <View style={styles.setting}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatarIcon} source={require('@/assets/icons/man.png')} />
          <Image style={styles.buttonRoundActive} source={require('@/assets/edit.png')} />
        </View>
        <View style={styles.nameWrapper}>
            <Text style={styles.name}>Saman Kumara</Text>
        </View>

        <ScrollView contentContainerStyle={styles.systemPopoverParent}>
          <TouchableOpacity onPress={() => router.push("/(routes)/personalInfo")} style={styles.infoRow}>
            <View style={styles.rowInformation}>
              <View style={styles.headlineParent}>
                <Text style={styles.headline}>Personal Information</Text>
                <Image style={styles.icon38} source={require('@/assets/icons/Group.png')} />
              </View>
              <View style={styles.divider}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(routes)/changepassword")} style={styles.infoRow}>
            <View style={styles.rowInformation}>
              <View style={styles.headlineParent}>
                <Text style={styles.headline}>Change Password</Text>
                <Image style={styles.icon38} source={require('@/assets/icons/Group.png')} />
              </View>
              <View style={styles.divider}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(routes)/WorkingInfo")} style={styles.infoRow}>
            <View style={styles.rowInformation}>
              <View style={styles.headlineParent}>
                <Text style={styles.headline}>Working Information</Text>
                <Image style={styles.icon38} source={require('@/assets/icons/Group.png')} />
              </View>
              <View style={styles.divider}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(tabs)/qr")} style={styles.rowInformation}>
            <View style={styles.headlineParent}>
              <Text style={styles.headline}>Log Out</Text>
              <Image style={styles.icon38} source={require('@/assets/icons/Group.png')} />
            </View>
            <View style={styles.divider}></View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  setting: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#f7f7fa',
    overflow: 'hidden',
  },
  avatarContainer: {
    position: 'absolute',
    top: 50, // Adjusted to remove extra space after header
    left: '50%',
    transform: [{ translateX: -50 }], // Center horizontally
    alignItems: 'center',
    zIndex: 1,
  },
  avatarIcon: {
    width: 100,
    height: 100,
  },
  buttonRoundActive: {
    height: 32,
    width: 32,
    position: 'absolute',
    bottom: 0, // Position at the bottom of the avatar
    right: -8, // Adjust to position partially inside the avatar
    zIndex: 2,
  },
  nameWrapper: {
    position: 'absolute',
    top: 160, // Adjust to position the name below the profile photo
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    zIndex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  systemPopoverParent: {
    marginTop: 200, // Adjusted for spacing after header
    paddingHorizontal: 24,
    paddingBottom: 292,
    gap: 5,
    backgroundColor: '#fff',
    paddingTop: 32,
    // paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoRow: {
    flexDirection: 'row',
    paddingBottom: 2,
  },
  rowInformation: {
    height: 36,
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 8,
    gap: 8,
    zIndex: 1,
  },
  headlineParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    textAlign: 'left',
    fontSize: 16,
    color: '#333',
  },
  headline: {
    lineHeight: 24,
    fontWeight: '500',
  },
  icon38: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  divider: {
    height: 1,
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});
