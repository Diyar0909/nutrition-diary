import {
  ACTIVITY_LEVEL_COEFFICIENTS,
  NutritionNorms,
  UserProfile,
} from "../types";

export function calculateBMR(profile: UserProfile): number {
  const { gender, weight, height, age } = profile;
  if (gender === "male") {
    return 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age;
  }
  return 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  return bmr * ACTIVITY_LEVEL_COEFFICIENTS[profile.activityLevel];
}

export function calculateNorms(profile: UserProfile): NutritionNorms {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(profile);

  let kcal = tdee;
  if (profile.goal === "lose") kcal = tdee - 500;
  if (profile.goal === "gain") kcal = tdee + 300;

  const proteinPerKg = profile.goal === "gain" ? 2 : 1.8;
  const protein_g = profile.weight * proteinPerKg;
  const fat_g = (kcal * 0.27) / 9;
  const proteinKcal = protein_g * 4;
  const fatKcal = fat_g * 9;
  const carbs_g = Math.max(0, (kcal - proteinKcal - fatKcal) / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    kcal: Math.round(kcal),
    protein_g: Math.round(protein_g),
    fat_g: Math.round(fat_g),
    carbs_g: Math.round(carbs_g),
  };
}

export interface WeightGoalInfo {
  diffKg: number;
  direction: "lose" | "gain" | "none";
  weeklyRate: number;
  weeksNeeded: number;
  weeklyTimeline: { week: number; expectedWeight: number }[];
}

export function calculateWeightGoal(profile: UserProfile): WeightGoalInfo {
  const diff = profile.targetWeight - profile.weight;
  const direction: WeightGoalInfo["direction"] =
    diff < 0 ? "lose" : diff > 0 ? "gain" : "none";
  const weeklyRate = direction === "lose" ? 0.5 : 0.3;
  const diffKg = Math.abs(diff);
  const weeksNeeded = direction === "none" ? 0 : Math.ceil(diffKg / weeklyRate);

  const timelineWeeks = Math.min(weeksNeeded, 8);
  const weeklyTimeline: WeightGoalInfo["weeklyTimeline"] = [];
  for (let week = 0; week <= timelineWeeks; week++) {
    const sign = direction === "lose" ? -1 : direction === "gain" ? 1 : 0;
    const expectedWeight = profile.weight + sign * weeklyRate * week;
    weeklyTimeline.push({ week, expectedWeight: Math.round(expectedWeight * 10) / 10 });
  }

  return { diffKg, direction, weeklyRate, weeksNeeded, weeklyTimeline };
}
