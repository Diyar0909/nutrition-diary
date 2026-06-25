import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/DashboardScreen";
import AddMealScreen from "../screens/AddMealScreen";
import NutritionPlanScreen from "../screens/NutritionPlanScreen";
import ActivityScreen from "../screens/ActivityScreen";
import WeightGoalScreen from "../screens/WeightGoalScreen";

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  Дашборд: "📊",
  Добавить: "➕",
  План: "🍽️",
  Спорт: "🏃",
  Цель: "🎯",
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#34C759",
        tabBarInactiveTintColor: "#999",
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Дашборд" component={DashboardScreen} />
      <Tab.Screen name="Добавить" component={AddMealScreen} />
      <Tab.Screen name="План" component={NutritionPlanScreen} />
      <Tab.Screen name="Спорт" component={ActivityScreen} />
      <Tab.Screen name="Цель" component={WeightGoalScreen} />
    </Tab.Navigator>
  );
}
