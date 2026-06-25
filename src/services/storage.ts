import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityPlan, MealEntry, NutritionPlan, UserProfile } from "../types";

const KEYS = {
  profile: "@nutrition_diary/profile",
  meals: "@nutrition_diary/meals",
  nutritionPlan: "@nutrition_diary/nutrition_plan",
  activityPlan: "@nutrition_diary/activity_plan",
};

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.profile);
  return raw ? JSON.parse(raw) : null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export async function loadMeals(): Promise<MealEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.meals);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMeals(meals: MealEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.meals, JSON.stringify(meals));
}

export async function loadNutritionPlan(): Promise<NutritionPlan | null> {
  const raw = await AsyncStorage.getItem(KEYS.nutritionPlan);
  return raw ? JSON.parse(raw) : null;
}

export async function saveNutritionPlan(plan: NutritionPlan): Promise<void> {
  await AsyncStorage.setItem(KEYS.nutritionPlan, JSON.stringify(plan));
}

export async function loadActivityPlan(): Promise<ActivityPlan | null> {
  const raw = await AsyncStorage.getItem(KEYS.activityPlan);
  return raw ? JSON.parse(raw) : null;
}

export async function saveActivityPlan(plan: ActivityPlan): Promise<void> {
  await AsyncStorage.setItem(KEYS.activityPlan, JSON.stringify(plan));
}
