export type Gender = "male" | "female";

export type Goal = "lose" | "maintain" | "gain";

export type ActivityLevel = 1 | 2 | 3 | 4 | 5;

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  1: "Минимальная",
  2: "Низкая",
  3: "Средняя",
  4: "Высокая",
  5: "Очень высокая",
};

export const ACTIVITY_LEVEL_COEFFICIENTS: Record<ActivityLevel, number> = {
  1: 1.2,
  2: 1.375,
  3: 1.55,
  4: 1.725,
  5: 1.9,
};

export const GOAL_LABELS: Record<Goal, string> = {
  lose: "Похудение",
  maintain: "Поддержание",
  gain: "Набор массы",
};

export interface UserProfile {
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  goal: Goal;
  activityLevel: ActivityLevel;
}

export interface NutritionNorms {
  bmr: number;
  tdee: number;
  kcal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Завтрак",
  lunch: "Обед",
  dinner: "Ужин",
  snack: "Перекус",
};

export interface DishAnalysis {
  name: string;
  weight_g: number;
  kcal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  note?: string;
}

export interface MealEntry extends DishAnalysis {
  id: string;
  type: MealType;
  date: string; // ISO date (yyyy-mm-dd)
  createdAt: string; // ISO datetime
}

export interface PlanMeal {
  type: MealType;
  name: string;
  kcal: number;
}

export interface PlanDay {
  day: string;
  meals: PlanMeal[];
  total_kcal: number;
}

export interface NutritionPlan {
  days: PlanDay[];
  tips: string[];
  generatedAt: string;
}

export type Intensity = "низкая" | "средняя" | "высокая";

export interface ActivityDay {
  day: string;
  activity: string;
  duration_min: number;
  intensity: Intensity;
  calories_burned: number;
  description: string;
}

export interface ActivityPlan {
  schedule: ActivityDay[];
  weekly_tips: string[];
  generatedAt: string;
}
