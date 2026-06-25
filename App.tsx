import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useAppContext } from "./src/context/AppContext";
import ProfileScreen from "./src/screens/ProfileScreen";
import MainTabs from "./src/navigation/MainTabs";

function RootNavigator() {
  const { isLoading, profile } = useAppContext();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#34C759" />
      </View>
    );
  }

  return profile ? <MainTabs /> : <ProfileScreen />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
