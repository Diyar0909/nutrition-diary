import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ActivityPlan, MealEntry, NutritionPlan, UserProfile } from "../types";
import {
  loadActivityPlan,
  loadMeals,
  loadNutritionPlan,
  loadProfile,
  saveActivityPlan,
  saveMeals,
  saveNutritionPlan,
  saveProfile,
} from "../services/storage";

interface AppContextValue {
  isLoading: boolean;
  profile: UserProfile | null;
  meals: MealEntry[];
  nutritionPlan: NutritionPlan | null;
  activityPlan: ActivityPlan | null;
  updateProfile: (profile: UserProfile) => Promise<void>;
  addMeal: (meal: MealEntry) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  updateNutritionPlan: (plan: NutritionPlan) => Promise<void>;
  updateActivityPlan: (plan: ActivityPlan) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [activityPlan, setActivityPlan] = useState<ActivityPlan | null>(null);

  useEffect(() => {
    (async () => {
      const [p, m, np, ap] = await Promise.all([
        loadProfile(),
        loadMeals(),
        loadNutritionPlan(),
        loadActivityPlan(),
      ]);
      setProfile(p);
      setMeals(m);
      setNutritionPlan(np);
      setActivityPlan(ap);
      setIsLoading(false);
    })();
  }, []);

  const updateProfile = useCallback(async (next: UserProfile) => {
    setProfile(next);
    await saveProfile(next);
  }, []);

  const addMeal = useCallback(
    async (meal: MealEntry) => {
      const next = [...meals, meal];
      setMeals(next);
      await saveMeals(next);
    },
    [meals]
  );

  const removeMeal = useCallback(
    async (id: string) => {
      const next = meals.filter((m) => m.id !== id);
      setMeals(next);
      await saveMeals(next);
    },
    [meals]
  );

  const updateNutritionPlan = useCallback(async (plan: NutritionPlan) => {
    setNutritionPlan(plan);
    await saveNutritionPlan(plan);
  }, []);

  const updateActivityPlan = useCallback(async (plan: ActivityPlan) => {
    setActivityPlan(plan);
    await saveActivityPlan(plan);
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      profile,
      meals,
      nutritionPlan,
      activityPlan,
      updateProfile,
      addMeal,
      removeMeal,
      updateNutritionPlan,
      updateActivityPlan,
    }),
    [
      isLoading,
      profile,
      meals,
      nutritionPlan,
      activityPlan,
      updateProfile,
      addMeal,
      removeMeal,
      updateNutritionPlan,
      updateActivityPlan,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
