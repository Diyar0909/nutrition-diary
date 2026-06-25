import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { generateActivityPlan } from "../services/aiService";

export default function ActivityScreen() {
  const { profile, activityPlan, updateActivityPlan } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!profile) return;
    setIsGenerating(true);
    try {
      const plan = await generateActivityPlan(profile);
      await updateActivityPlan(plan);
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
      <Text style={styles.title}>Физическая активность</Text>
      <Text style={styles.subtitle}>Персональный план тренировок от AI на неделю</Text>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate} disabled={isGenerating}>
        {isGenerating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateButtonText}>
            {activityPlan ? "Перегенерировать план" : "Сгенерировать план"}
          </Text>
        )}
      </TouchableOpacity>

      {activityPlan && (
        <>
          <Text style={styles.generatedAt}>
            Обновлено: {new Date(activityPlan.generatedAt).toLocaleString("ru-RU")}
          </Text>

          {activityPlan.schedule.map((item, idx) => (
            <View key={idx} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{item.day}</Text>
                <Text style={[styles.intensity, intensityStyle(item.intensity)]}>
                  {item.intensity}
                </Text>
              </View>
              <Text style={styles.activityName}>{item.activity}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{item.duration_min} мин</Text>
                <Text style={styles.meta}>{item.calories_burned} ккал</Text>
              </View>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Советы по тренировкам</Text>
          {activityPlan.weekly_tips.map((tip, idx) => (
            <Text key={idx} style={styles.tip}>
              • {tip}
            </Text>
          ))}
        </>
      )}
    </ScrollView>
  );
}

function intensityStyle(intensity: string) {
  if (intensity === "высокая") return { color: "#FF3B30" };
  if (intensity === "средняя") return { color: "#FF9500" };
  return { color: "#34C759" };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 60 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 16 },
  generateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  generateButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  generatedAt: { fontSize: 12, color: "#999", marginTop: 12, marginBottom: 12 },
  dayCard: { backgroundColor: "#F9F9FB", borderRadius: 12, padding: 14, marginBottom: 10 },
  dayHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  dayTitle: { fontWeight: "700", fontSize: 15, color: "#1A1A1A" },
  intensity: { fontWeight: "700", fontSize: 12, textTransform: "uppercase" },
  activityName: { fontSize: 15, fontWeight: "600", color: "#333", marginTop: 2 },
  description: { fontSize: 13, color: "#666", marginTop: 2 },
  metaRow: { flexDirection: "row", gap: 16, marginTop: 8 },
  meta: { fontSize: 13, color: "#555", fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 16, marginBottom: 8, color: "#1A1A1A" },
  tip: { fontSize: 14, color: "#333", marginBottom: 6 },
});
