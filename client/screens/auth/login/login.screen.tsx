import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import {
    Entypo,
    FontAwesome,
    Fontisto,
    Ionicons,
    SimpleLineIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
    useFonts,
    Raleway_700Bold,
    Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { useState } from "react";
import { router } from "expo-router";
// import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../../../constants/Colors";


export default function LoginScreen() {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const toast = useToast();
    const [required, setRequired] = useState("");
    const [error, setError] = useState({
        password: "",
    });

    let [fontsLoaded, fontError] = useFonts({
        Raleway_600SemiBold,
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_700Bold,
        Nunito_600SemiBold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    // const handlePasswordValidation = (value: string) => {
    //     const password = value;
    //     const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    //     const passwordOneNumber = /(?=.*[0-9])/;
    //     const passwordSixValue = /(?=.{6,})/;

    //     if (!passwordSpecialCharacter.test(password)) {
    //         setError({
    //             ...error,
    //             password: "Write at least one special character",
    //         });
    //         setuserInfo({ ...userInfo, password: "" });
    //     } else if (!passwordOneNumber.test(password)) {
    //         setError({
    //             ...error,
    //             password: "Write at least one number",
    //         });
    //         setuserInfo({ ...userInfo, password: "" });
    //     } else if (!passwordSixValue.test(password)) {
    //         setError({
    //             ...error,
    //             password: "Write at least 6 characters",
    //         });
    //         setuserInfo({ ...userInfo, password: "" });
    //     } else {
    //         setError({
    //             ...error,
    //             password: "",
    //         });
    //         setuserInfo({ ...userInfo, password: value });
    //     }
    // };


    // const handleSignIn = async () => {
    //     setButtonSpinner(true);
    //     try {
    //         // localhost
    //         const res = await axios.post('http://192.168.238.186:5000/login', { 
    //             email,
    //             password,
    //         });
    //         await AsyncStorage.setItem('access_token', res.data.token);  
            
    //         router.push("/(tabs)");

    //         console.log('Login successful');
    //         toast.show('Login successful!', {
    //         type: 'success',});
    //     } catch (error) {
    //         console.log(error);
    //         toast.show('Email or password is not correct!', {
    //             type: 'danger',
    //         });
    //     } finally {
    //         setButtonSpinner(false);
    //     }
    // };
    const handleSignIn = () => {
        setButtonSpinner(true); // Set loading state, if needed
    
        axios.post('http://192.168.238.115:5000/login', {
            email,
            password
        })
        .then(async response => {
            // Check if the response contains the token and user data
            if (response.data && response.data.token) {
                // Save the token to AsyncStorage
                await AsyncStorage.setItem('access_token', response.data.token);
                console.log('Token saved successfully');
    
                // Save user data to AsyncStorage
                const userData = response.data.user;
    
                // Ensure user data is stringified before saving
                await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    
                // Retrieve user data from AsyncStorage
                const userDataString = await AsyncStorage.getItem('user_data');
                if (userDataString) {
                    const parsedUserData = JSON.parse(userDataString);
                    console.log('User data:', parsedUserData);
                    console.log('User ID:', parsedUserData.user_id);
    
                    // Save user_id separately if needed
                    await AsyncStorage.setItem('user_id', parsedUserData.user_id);
                } else {
                    console.log('No user data found');
                }
    
                // Redirect to another page, e.g., home page
                router.push("/(tabs)");
    
                // Show success message
                toast.show('Login successful!', { type: 'success' });
            } else {
                console.error('Response data is missing expected fields');
            }
        })
        .catch(error => {
            // Handle different types of errors
            if (error.response) {
                // Server responded with a status other than 2xx
                const statusCode = error.response.status;
                if (statusCode === 400) {
                    toast.show('Email or password is incorrect!', { type: 'danger' });
                } else if (statusCode === 403) {
                    toast.show('Unauthorized role. Access denied.', { type: 'danger' });
                } else {
                    toast.show('An unexpected error occurred. Please try again.', { type: 'danger' });
                }
            } else if (error.request) {
                // Request was made but no response was received
                console.error('No response received:', error.request);
                toast.show('No response from server. Please check your connection.', { type: 'danger' });
            } else {
                // Something happened in setting up the request
                console.error('Error setting up request:', error.message);
                toast.show('Error setting up request. Please try again.', { type: 'danger' });
            }
        })
        .finally(() => {
            // Reset loading state
            setButtonSpinner(false);
        });
    };
    

    // After successful login
    const storeToken = async (token: string) => {
        try {
            await AsyncStorage.setItem('token', token);
            console.log('Token stored successfully');
        } catch (error) {
            console.error('Failed to store token:', error);
        }
    };
    

    return (
        <LinearGradient
            colors={[colors.tertiary, "white"]}
            style={{ flex: 1 }}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <Image
                        style={styles.signInImage}
                        source={require("@/assets/sign-in/signin.webp")}
                    />
                    <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
                        Welcome Back!
                    </Text>
                    <Text style={styles.learningText}>
                        Login to your existing account of ParkEase
                    </Text>
                    <View style={styles.inputContainer}>
                        <View>
                            <TextInput
                                style={[styles.input, { paddingLeft: 40 }]}
                                keyboardType="email-address"
                                value={email}
                                placeholder="support@becodemy.com"
                                onChangeText={setEmail}
                          
                                
                            />
                            <Fontisto
                                style={{ position: "absolute", left: 26, top: 17.8 }}
                                name="email"
                                size={20}
                                color={"#A1A1A1"}
                            />
                            {required && (
                                <View style={styles.errorContainer}>
                                    <Entypo name="cross" size={18} color={"red"} />
                                </View>
                            )}
                            <View style={{ marginTop: 15 }}>
                                <TextInput
                                      style={styles.input}
                                      secureTextEntry={!isPasswordVisible}
                                      placeholder="********"
                                      value={password}
                                      onChangeText={setPassword}
                                   
                                />
                                <TouchableOpacity
                                    style={styles.visibleIcon}
                                    onPress={() => setPasswordVisible(!isPasswordVisible)}
                                >
                                    {isPasswordVisible ? (
                                        <Ionicons
                                            name="eye-off-outline"
                                            size={23}
                                            color={"#747474"}
                                        />
                                    ) : (
                                        <Ionicons name="eye-outline" size={23} color={"#747474"} />
                                    )}
                                </TouchableOpacity>
                                <SimpleLineIcons
                                    style={styles.icon2}
                                    name="lock"
                                    size={20}
                                    color={"#A1A1A1"}
                                />
                            </View>
                            {error.password && (
                                <View style={[styles.errorContainer, { top: 145 }]}>
                                    <Entypo name="cross" size={18} color={"red"} />
                                    <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
                                        {error.password}
                                    </Text>
                                </View>
                            )}
                            <TouchableOpacity
                                onPress={() => router.push("/(routes)/forgot-password")}
                            >
                                <Text
                                    style={[
                                        styles.forgotSection,
                                        { fontFamily: "Nunito_600SemiBold" },
                                    ]}
                                >
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    padding: 16,
                                    borderRadius: 8,
                                    marginHorizontal: 16,
                                    marginTop: 15,
                                    backgroundColor: "rgba(26, 33, 49, 1)",
                                }}
                                onPress={handleSignIn}
                            >
                                {buttonSpinner ? (
                                    <ActivityIndicator size="small" color={"white"} />
                                ) : (
                                    <Text
                                        style={{
                                            color: "white",
                                            textAlign: "center",
                                            fontSize: 16,
                                            fontFamily: "Raleway_700Bold",
                                        }}
                                    >
                                        Login
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 20,
                                    gap: 10,
                                }}
                            >
                                <TouchableOpacity>
                                    <FontAwesome name="google" size={30} />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <FontAwesome name="github" size={30} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.signupRedirect}>
                                <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
                                    Don't have an account?
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.push("/(routes)/sign-up")}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontFamily: "Raleway_600SemiBold",
                                            color: "#2467EC",
                                            marginLeft: 5,
                                        }}
                                    >
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    signInImage: {
        width: "80%",
        height: 250,
        alignSelf: "center",
        marginTop: 25,
        marginBottom: 25,
    },
    welcomeText: {
        textAlign: "center",
        fontSize: 24,
    },
    learningText: {
        textAlign: "center",
        color: "#575757",
        fontSize: 15,
        marginTop: 5,
    },
    inputContainer: {
        marginHorizontal: 16,
        marginTop: 30,
        rowGap: 30,
    },
    input: {
        height: 55,
        marginHorizontal: 16,
        borderRadius: 8,
        paddingLeft: 35,
        fontSize: 16,
        backgroundColor: "white",
        color: "#A1A1A1",
    },
    visibleIcon: {
        position: "absolute",
        right: 30,
        top: 15,
    },
    icon2: {
        position: "absolute",
        left: 23,
        top: 17.8,
        marginTop: -2,
    },
    forgotSection: {
        marginHorizontal: 16,
        textAlign: "right",
        fontSize: 16,
        marginTop: 10,
    },
    signupRedirect: {
        flexDirection: "row",
        marginHorizontal: 16,
        justifyContent: "center",
        marginBottom: 20,
        marginTop: 20,
    },
    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        position: "absolute",
        top: 60,
    },
});


