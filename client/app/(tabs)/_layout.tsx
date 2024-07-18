// import useUser from "@/hooks/auth/useUser";
import { Tabs } from "expo-router";
import { Image,Text } from "react-native";

export default function TabsLayout() {
  // const { user } = useUser();
  return (
    <Tabs 
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === "index") {
              iconName = require("@/assets/icons/HouseSimple.png");
            } else if (route.name === "history/index") {
              iconName = require("@/assets/icons/history.png");
            } else if (route.name === "qr/index") {
              iconName = require("@/assets/icons/qr.png");
            } else if (route.name === "insights/index") {
              iconName = require("@/assets/icons/BookBookmark.png");
            } else if (route.name === "profile/index") {
              iconName = require("@/assets/icons/User.png");
            }
            return (
              <Image
                style={{ width: 25, height: 25, tintColor: color }}
                source={iconName}
              />
            );
          },

          tabBarLabel: ({ focused, color }) => {
            let label;
            if (route.name === "index") {
              label = 'Home';
            } else if (route.name === "history/index") {
              label = 'History';
            } else if (route.name === "qr/index") {
              label = 'QR Code';
            } else if (route.name === "insights/index") {
              label = 'Insights';
            } else if (route.name === "profile/index") {
              label = 'Profile';
            }
            return <Text style={{ color:"white", fontSize: 12 }}>{label}</Text>;
          },

          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: 'rgba(26, 33, 49, 1)', // Set your desired background color here
          },
        };
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history/index" />
      <Tabs.Screen name="qr/index" />
      <Tabs.Screen name="insights/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}
