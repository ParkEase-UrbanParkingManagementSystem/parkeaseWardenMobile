import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { View } from 'react-native';
import OnBoarding from './(routes)/onboarding';
import { Stack } from 'expo-router';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
        {isLoggedIn ? (
          <View>
            </View>
        ): (
          <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name='index'/>
            <Stack.Screen name="(routes)/welcome-intro/index" />
            <Stack.Screen name="(routes)/login/index" />
            <Stack.Screen
              name="(routes)/viewParkedVehicle/index"
              options={{
                headerShown: true,
                title: "View Vehicle",
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="(routes)/changepassword/index"
              options={{
                headerShown: true,
                title: "Change Password",
                headerBackTitle: "Back",
              }}
            />

            <Stack.Screen
              name="(routes)/personalInfo/index"
              options={{
                headerShown: true,
                title: "Personal Iformation",
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="(routes)/WorkingInfo/index"
              options={{
                headerShown: true,
                title: "Working Information",
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="(routes)/addVehicle/index"
              options={{
                headerShown: true,
                title: "Add Vehicle",
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="(routes)/viewHistoryVehicle/index"
              options={{
                headerShown: true,
                title: "Back",
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="(routes)/checkout/index"
              options={{
                headerShown: true,
                title: "Checkout",
                headerBackTitle: "Back",
              }}
            />
          </Stack>
        )}
    </>
  );
}
