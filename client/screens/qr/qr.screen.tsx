import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';


const QRScanner = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [vehicleId, setVehicleId] = useState('');
    const [userId, setUserId] = useState('');
    const [parkingSlotId, setParkingSlotId] = useState('');
    const [isAllowedToPark, setIsAllowedToPark] = useState(false);
    const router = useRouter(); // Initialize router

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
            // localhost
            const response = await fetch('http://172.20.10.3:5000/check-parking-status', {
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
                setIsAllowedToPark(true);
                console.log('Parking is allowed');
            } else {
                setIsAllowedToPark(false);
                console.log('One or both are already parked:', result);
                Alert.alert('Error', 'One or both are already parked');
            }
        } catch (error) {
            console.error('Error during parking status check:', error);
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'An unknown error occurred');
            }
        }
    };

    const handleConfirm = async () => {
        if (!isAllowedToPark) {
            Alert.alert('Error', 'Parking is not allowed');
            return;
        }

        try {
            const user_id = await AsyncStorage.getItem('user_id');

            const response = await fetch('http://172.20.10.3:5000/assign-parking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vehicle_id: vehicleId,
                    driver_id: userId,
                    user_id:user_id // Include the user_id in the JSON object

                })
            });

            if (!response.ok) {
                throw new Error('Failed to assign parking slot');
            }

            const result = await response.json();
            Alert.alert('Success', result.message);

            router.push('(tabs)?refresh=true');

        } catch (error) {
            console.error('Error during parking slot assignment:', error);
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'An unknown error occurred');
            }
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
                    <Text style={styles.scanAgainButtonText}>Tap to Scan Again</Text>
                </TouchableOpacity>
            )}
            {isAllowedToPark && (
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
                    {/* <TextInput
                        style={styles.input}
                        placeholder="Enter Parking Slot ID"
                        value={parkingSlotId}
                        onChangeText={(text) => setParkingSlotId(text)}
                    /> */}
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
    scanResult: {
        fontSize: 16,
        color: 'black',
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
//             const response = await fetch('http://172.20.10.3:5000/check-parking-status', {
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
//             const response = await fetch('http://172.20.10.3:5000/assign-parking', {
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
//             const response = await fetch('http://172.20.10.3:5000/assign-parking', {
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
