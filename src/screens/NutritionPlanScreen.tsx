import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { generateNutritionPlan } from "../services/aiService";
import { calculateNorms } from "../utils/calculations";
import { MEAL_TYPE_LABELS } from "../types";

export default function NutritionPlanScreen() {
  const { profile, nutritionPlan, updateNutritionPlan } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!profile) return;
    setIsGenerating(true);
    try {
      const norms = calculateNorms(profile);
      const plan = await generateNutritionPlan(profile, norms);
      await updateNutritionPlan(plan);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Сначала заполните профиль</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>План питания на неделю</Text>
      <Text style={styles.subtitle}>Персональное меню от AI на основе вашего профиля</Text>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate} disabled={isGenerating}>
        {isGenerating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateButtonText}>
            {nutritionPlan ? "Перегенерировать план" : "Сгенерировать план"}
          </Text>
        )}
      </TouchableOpacity>

      {nutritionPlan && (
        <>
          <Text style={styles.generatedAt}>
            Обновлено: {new Date(nutritionPlan.generatedAt).toLocaleString("ru-RU")}
          </Text>

          {nutritionPlan.days.map((day) => (
            <View key={day.day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day.day}</Text>
                <Text style={styles.dayTotal}>{day.total_kcal} ккал</Text>
              </View>
              {day.meals.map((meal, idx) => (
                <View key={idx} style={styles.mealRow}>
                  <Text style={styles.mealType}>{MEAL_TYPE_LABELS[meal.type]}</Text>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealKcal}>{meal.kcal} ккал</Text>
                </View>
              ))}
            </View>
          ))}

          <Text style={styles.sectionTitle}>Советы по питанию</Text>
          {nutritionPlan.tips.map((tip, idx) => (
            <Text key={idx} style={styles.tip}>
              • {tip}
            </Text>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 60 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 16 },
  generateButton: {
    backgroundColor: "#34C759",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  generateButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  generatedAt: { fontSize: 12, color: "#999", marginTop: 12, marginBottom: 12 },
  dayCard: { backgroundColor: "#F9F9FB", borderRadius: 12, padding: 14, marginBottom: 10 },
  dayHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  dayTitle: { fontWeight: "700", fontSize: 15, color: "#1A1A1A" },
  dayTotal: { fontWeight: "700", color: "#FF9500" },
  mealRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  mealType: { fontSize: 12, color: "#888", width: 70 },
  mealName: { fontSize: 13, color: "#333", flex: 1 },
  mealKcal: { fontSize: 13, color: "#555", fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 16, marginBottom: 8, color: "#1A1A1A" },
  tip: { fontSize: 14, color: "#333", marginBottom: 6 },
});
