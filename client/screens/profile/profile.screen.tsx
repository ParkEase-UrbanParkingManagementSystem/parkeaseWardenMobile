import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import Header3 from "@/components/header3/header3";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { BASE_URL } from "../../config";


export default function Settings() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the profile picture from AsyncStorage on component mount
    const getProfilePicture = async () => {
      const storedPicture = await AsyncStorage.getItem('profilePicture');
      setProfilePicture(storedPicture); // This is now safe because storedPicture is string | null
    };

    getProfilePicture();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.clear();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleEditProfilePicture = () => {
    Alert.alert(
      "Change Profile Picture",
      "Choose an option",
      [
        { text: "Take Photo", onPress: openCamera },
        { text: "Choose from Gallery", onPress: openGallery },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "Camera access is required to take a photo. Please enable it in your device settings."
        );
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
      });
  
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        saveProfilePicture(imageUri);
      }
    } catch (error) {
      console.error('Error launching camera:', error);
    }
  };
  
  
  const openGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "Gallery access is required to select a photo. Please enable it in your device settings."
        );
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });
  
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        saveProfilePicture(imageUri);
      }
    } catch (error) {
      console.error('Error selecting image from gallery:', error);
    }
  };
  


  const saveProfilePicture = async (imageUri: string) => {
    try {
      await AsyncStorage.setItem('profilePicture', imageUri);
      setProfilePicture(imageUri); // Update the state with the new picture

      // Upload to server
      await saveProfilePictureToServer(imageUri);
    } catch (error) {
      console.error('Error saving profile picture:', error);
    }
  };

  const saveProfilePictureToServer = async (imageUri: string) => {
    const formData = new FormData();
  
    try {
      // Fetch the image from the URI and convert it to a Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      // Append the Blob to FormData with the filename
      formData.append('profilePicture', blob, 'profile.jpg');
  
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        Alert.alert("Authentication Error", "user_id is missing.");
        return;
      }
  
      const responseUpload = await axios.post(
        `${BASE_URL}/upload-profile-picture?user_id=${user_id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      const { imageUrl } = responseUpload.data;
      if (!imageUrl) {
        Alert.alert('Error', 'The server did not return a valid image URL.');
        return;
      }
  
      // Save the image URL to AsyncStorage and update the state
      await AsyncStorage.setItem('profilePicture', imageUrl);
      setProfilePicture(imageUrl);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Success', 'Profile picture uploaded successfully.');
    }
  };
  
  
  
  
  
  
  
  

  return (
    <LinearGradient 
      colors={[colors.background, "white"]}
      style={{ flex: 1, paddingTop: 0 }}
    >
      <Header3 />
      <View style={styles.setting}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatarIcon}
            source={profilePicture ? { uri: profilePicture } : require('@/assets/icons/man.png')}
          />
          <TouchableOpacity onPress={handleEditProfilePicture}>
            <Image style={styles.buttonRoundActive} source={require('@/assets/edit.png')} />
          </TouchableOpacity>
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
          <TouchableOpacity onPress={handleLogout} style={styles.rowInformation}>
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
    top: 50,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    zIndex: 1,
  },
  avatarIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonRoundActive: {
    height: 32,
    width: 32,
    position: 'absolute',
    bottom: 0,
    right: -50,//adjust button
    zIndex: 2,
  },
  nameWrapper: {
    position: 'absolute',
    top: 160,
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
    marginTop: 200,
    paddingHorizontal: 24,
    paddingBottom: 292,
    gap: 5,
    backgroundColor: '#fff',
    paddingTop: 32,
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
