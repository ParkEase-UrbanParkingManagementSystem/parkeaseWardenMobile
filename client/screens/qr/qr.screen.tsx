import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { BASE_URL } from '../../config'; // Adjust the import path based on your file structure


const QRScanner = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [scanResult, setScanResult] = useState<string>('');
    const [vehicleId, setVehicleId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [isAllowedToPark, setIsAllowedToPark] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>('');
    const [popupType, setPopupType] = useState<'park' | 'exit' | null>(null);
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            // Reset state when the screen is focused
            setScanned(false);
            setScanResult('');
            setVehicleId('');
            setUserId('');
            setIsAllowedToPark(false);
            setPopupMessage('');
            setPopupType(null);
        }, [])
    );

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
        setScanned(true);
        setScanResult(data);
        const [vehicle, user] = data.split(',').map(part => part.split(':')[1].trim());
        setVehicleId(vehicle);
        setUserId(user);

        try {
            // const response = await fetch('http://192.168.238.186:5003/check-parking-status', {
                const response = await fetch(`${BASE_URL}/check-parking-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vehicle_id: vehicle,
                    user_id: user
                })
            });

            if (!response.ok) {
                throw new Error('Failed to check parking status');
            }

            const result = await response.json();
            console.log('Parking status response:', result);

            if (!result.isVehicleParked && !result.isDriverParked) {
                setPopupMessage('Park the vehicle');
                setPopupType('park');
            } else {
                setPopupMessage('Exit the vehicle');
                setPopupType('exit');
            }
        } catch (error) {
            console.error('Error during parking status check:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    const handleConfirm = async () => {
        if (popupType === 'park') {
            try {
                const user_id = await AsyncStorage.getItem('user_id');

                // const response = await fetch('http://192.168.238.186:5003/assign-parking', {
                const response = await fetch(`${BASE_URL}/assign-parking`, {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        vehicle_id: vehicleId,
                        driver_id: userId,
                        user_id: user_id
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to assign parking slot');
                }

                const result = await response.json();
                Alert.alert('Success', 'Vehicle successfully added');
                router.push('(tabs)?refresh=true'); // Redirect to home page with refresh
            } catch (error) {
                console.error('Error during parking slot assignment:', error);
                Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
            }
        } else if (popupType === 'exit') {
            // // Call the endpoint for exiting the vehicle here
            // // await fetch('http://your-server-endpoint-for-exit', {...});

            // Alert.alert('Info', 'Redirecting to profile page');
            // router.push('/viewParkedVehicle'); // Redirect to profile page

            try {
                const user_id = await AsyncStorage.getItem('user_id');

                    // const response = await axios.get('http://192.168.238.186:5003/exit-from-qr', {
                        const response = await axios.get(`${BASE_URL}/exit-from-qr`, {

                        params: { vehicle_id: vehicleId, driver_id: userId, user_id: user_id},
                      });

                // console.log('Raw response text:', response);


                if (!response) {
                    throw new Error('Failed to exit');
                }
                 // Extract the data from the response
                const responseData = response.data;
                console.log('Raw response text///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////:');

                console.log('Exit response:', responseData);
                router.push({
                    pathname: '/viewParkedVehicle',
                    params: { data: JSON.stringify(responseData) } // Passing the data as a query parameter
                });
            } catch (error) {
                console.error('Error during parking slot assignment:', error);
                Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
            }
        }
    };

    const handleScanAgain = () => {
        setScanned(false);
        setVehicleId('');
        setUserId('');
        setPopupMessage('');
        setPopupType(null);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {!scanned && !popupType && (
                <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(true)}>
                    <Text style={styles.scanButtonText}>Tap to Scan</Text>
                </TouchableOpacity>
            )}
            {scanned && !popupType && (
                <BarCodeScanner
                    onBarCodeScanned={scanned ? handleBarCodeScanned : undefined}
                    style={StyleSheet.absoluteFillObject}
                />
            )}
            {scanned && !popupType && (
                <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
                    <Text style={styles.scanAgainButtonText}>Tap to Scan Again</Text>
                </TouchableOpacity>
            )}
            {popupType && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Vehicle ID"
                        value={vehicleId}
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="User ID"
                        value={userId}
                        editable={false}
                    />
                    <Text style={styles.popupMessage}>{popupMessage}</Text>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanButton: {
        padding: 20,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    scanButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scanAgainButton: {
        alignSelf: 'center',
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
        marginTop: 20,
    },
    scanAgainButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '80%',
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    confirmButton: {
        alignSelf: 'center',
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        marginTop: 20,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    popupMessage: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default QRScanner;










// isparked working but not for isparked=true

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { Camera } from 'expo-camera';
// import { useNavigation } from '@react-navigation/native';

// const QRScanner = () => {
//     const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//     const [scanned, setScanned] = useState(false);
//     const [scanResult, setScanResult] = useState('');
//     const [vehicleId, setVehicleId] = useState('');
//     const [userId, setUserId] = useState('');
//     const [parkingSlotId, setParkingSlotId] = useState('');
//     const [isAllowedToPark, setIsAllowedToPark] = useState(false);

//     useEffect(() => {
//         (async () => {
//             const { status } = await Camera.requestCameraPermissionsAsync();
//             setHasPermission(status === 'granted');
//         })();
//     }, []);

//     const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
//         setScanned(true);
//         setScanResult(data);
//         const [vehicle, user] = data.split(',').map(part => part.split(':')[1].trim());
//         setVehicleId(vehicle);
//         setUserId(user);

//         try {
//             const response = await fetch('http://192.168.8.198:5003/check-parking-status', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     vehicle_id: vehicle,
//                     user_id: user
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to check parking status');
//             }

//             const result = await response.json();

//             if (!result.isVehicleParked && !result.isDriverParked) {
//                 setIsAllowedToPark(true);
//             } else {
//                 console.log('One or both are already parked:', result); // Log instead of navigation
//                 // Additional logging if needed
//                 throw new Error('One or both are already parked');
//             }
//         } catch (error) {
//             if (error instanceof Error) {
//                 Alert.alert('Error', error.message);
//             } else {
//                 Alert.alert('Error', 'An unknown error occurred');
//             }
//         }
//     };

//     const handleConfirm = async () => {
//         try {
//             const response = await fetch('http://192.168.8.198:5003/assign-parking', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     vehicle_id: vehicleId,
//                     user_id: userId,
//                     parking_slot_id: parkingSlotId
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to assign parking slot');
//             }

//             const result = await response.json();
//             Alert.alert('Success', result.message); // Display success message
//         } catch (error) {
//             if (error instanceof Error) {
//                 Alert.alert('Error', error.message);
//             } else {
//                 Alert.alert('Error', 'An unknown error occurred');
//             }
//         }
//     };

//     if (hasPermission === null) {
//         return <Text>Requesting for camera permission</Text>;
//     }
//     if (hasPermission === false) {
//         return <Text>No access to camera</Text>;
//     }

//     return (
//         <View style={styles.container}>
//             <BarCodeScanner
//                 onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//                 style={StyleSheet.absoluteFillObject}
//             />
//             {scanned && (
//                 <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
//                     <Text style={styles.scanAgainButtonText}>Tap to Scan Again</Text>
//                 </TouchableOpacity>
//             )}
//             {isAllowedToPark && (
//                 <View style={styles.inputContainer}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Vehicle ID"
//                         value={vehicleId}
//                         editable={false}
//                     />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="User ID"
//                         value={userId}
//                         editable={false}
//                     />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter Parking Slot ID"
//                         value={parkingSlotId}
//                         onChangeText={(text) => setParkingSlotId(text)}
//                     />
//                     <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
//                         <Text style={styles.confirmButtonText}>Confirm</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     inputContainer: {
//         position: 'absolute',
//         bottom: 50,
//         width: '100%',
//         alignItems: 'center',
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         width: '80%',
//         paddingHorizontal: 10,
//         marginBottom: 10,
//         backgroundColor: 'white',
//     },
//     scanResult: {
//         fontSize: 16,
//         color: 'black',
//     },
//     scanAgainButton: {
//         alignSelf: 'center',
//         padding: 10,
//         backgroundColor: '#2196F3',
//         borderRadius: 5,
//         marginTop: 20,
//     },
//     scanAgainButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     confirmButton: {
//         alignSelf: 'center',
//         padding: 10,
//         backgroundColor: '#4CAF50',
//         borderRadius: 5,
//         marginTop: 20,
//     },
//     confirmButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default QRScanner;









// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { Camera } from 'expo-camera';
// import { useNavigation } from '@react-navigation/native';

// const QRScanner = () => {
//     const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//     const [scanned, setScanned] = useState(false);
//     const [scanResult, setScanResult] = useState('');
//     const [vehicleId, setVehicleId] = useState('');
//     const [userId, setUserId] = useState('');
//     const [parkingSlotId, setParkingSlotId] = useState('');

//     useEffect(() => {
//         (async () => {
//             const { status } = await Camera.requestCameraPermissionsAsync();
//             setHasPermission(status === 'granted');
//         })();
//     }, []);

//     const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
//         setScanned(true);
//         setScanResult(data);
//         const [vehicle, user] = data.split(',').map(part => part.split(':')[1].trim());
//         setVehicleId(vehicle);
//         setUserId(user);
//     };

//     const handleConfirm = async () => {
//         try {
//             const response = await fetch('http://192.168.8.198:5003/assign-parking', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     vehicle_id: vehicleId,
//                     user_id: userId,
//                     parking_slot_id: parkingSlotId
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to assign parking slot');
//             }

//             const result = await response.json();
//             Alert.alert('Success', result.message); // Display success message
//         } catch (error) {
//             if (error instanceof Error) {
//                 Alert.alert('Error', error.message);
//             } else {
//                 Alert.alert('Error', 'An unknown error occurred');
//             }
//         }
//     };

//     if (hasPermission === null) {
//         return <Text>Requesting for camera permission</Text>;
//     }
//     if (hasPermission === false) {
//         return <Text>No access to camera</Text>;
//     }

//     return (
//         <View style={styles.container}>
//             <BarCodeScanner
//                 onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//                 style={StyleSheet.absoluteFillObject}
//             />
//             {scanned && (
//                 <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
//                     <Text style={styles.scanAgainButtonText}>Tap to Scan Again</Text>
//                 </TouchableOpacity>
//             )}
//             <View style={styles.inputContainer}>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Vehicle ID"
//                     value={vehicleId}
//                     editable={false}
//                 />
//                 <TextInput
//                     style={styles.input}
//                     placeholder="User ID"
//                     value={userId}
//                     editable={false}
//                 />
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter Parking Slot ID"
//                     value={parkingSlotId}
//                     onChangeText={(text) => setParkingSlotId(text)}
//                 />
//                 <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
//                     <Text style={styles.confirmButtonText}>Confirm</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     inputContainer: {
//         position: 'absolute',
//         bottom: 50,
//         width: '100%',
//         alignItems: 'center',
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         width: '80%',
//         paddingHorizontal: 10,
//         marginBottom: 10,
//         backgroundColor: 'white',
//     },
//     scanResult: {
//         fontSize: 16,
//         color: 'black',
//     },
//     scanAgainButton: {
//         alignSelf: 'center',
//         padding: 10,
//         backgroundColor: '#2196F3',
//         borderRadius: 5,
//         marginTop: 20,
//     },
//     scanAgainButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     confirmButton: {
//         alignSelf: 'center',
//         padding: 10,
//         backgroundColor: '#4CAF50',
//         borderRadius: 5,
//         marginTop: 20,
//     },
//     confirmButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default QRScanner;
