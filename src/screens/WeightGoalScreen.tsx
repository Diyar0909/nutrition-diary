import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { calculateWeightGoal } from "../utils/calculations";

export default function WeightGoalScreen() {
  const { profile } = useAppContext();

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Сначала заполните профиль</Text>
      </View>
    );
  }

  const goalInfo = calculateWeightGoal(profile);

  const directionLabel =
    goalInfo.direction === "lose"
      ? "сбросить"
      : goalInfo.direction === "gain"
      ? "набрать"
      : "вес уже соответствует цели";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Цель по весу</Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{profile.weight} кг</Text>
          <Text style={styles.summaryLabel}>Текущий вес</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{profile.targetWeight} кг</Text>
          <Text style={styles.summaryLabel}>Целевой вес</Text>
        </View>
      </View>

      {goalInfo.direction === "none" ? (
        <Text style={styles.infoText}>Поздравляем! Ваш текущий вес уже совпадает с целевым.</Text>
      ) : (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardText}>
              Нужно {directionLabel} {goalInfo.diffKg.toFixed(1)} кг
            </Text>
            <Text style={styles.infoCardSub}>
              При темпе {goalInfo.weeklyRate} кг/нед — примерно {goalInfo.weeksNeeded} недель
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Timeline прогресса</Text>
          <View style={styles.timeline}>
            {goalInfo.weeklyTimeline.map((point) => (
              <View key={point.week} style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <Text style={styles.timelineWeek}>Неделя {point.week}</Text>
                <Text style={styles.timelineWeight}>{point.expectedWeight} кг</Text>
              </View>
            ))}
            {goalInfo.weeksNeeded > 8 && (
              <Text style={styles.timelineMore}>
                …и ещё {goalInfo.weeksNeeded - 8} недель до достижения цели
              </Text>
            )}
          </View>
        </>
      )}

      <View style={styles.safetyBlock}>
        <Text style={styles.safetyTitle}>Безопасный темп изменения веса</Text>
        <Text style={styles.safetyText}>
          Рекомендуемый темп — 0.5 кг в неделю при похудении и 0.3 кг в неделю при наборе массы.
          Более быстрые темпы могут негативно влиять на здоровье и приводить к потере мышечной массы
          или быстрому возврату веса.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 60 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", marginBottom: 16 },
  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  summaryBox: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  summaryValue: { fontSize: 20, fontWeight: "800", color: "#1A1A1A" },
  summaryLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  infoText: { fontSize: 15, color: "#333", textAlign: "center", marginTop: 12 },
  infoCard: { backgroundColor: "#F2F8F2", borderRadius: 12, padding: 16, marginBottom: 16 },
  infoCardText: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  infoCardSub: { fontSize: 13, color: "#666", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#1A1A1A" },
  timeline: { marginBottom: 20 },
  timelineRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#34C759", marginRight: 10 },
  timelineWeek: { flex: 1, fontSize: 14, color: "#333" },
  timelineWeight: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  timelineMore: { fontSize: 12, color: "#999", marginTop: 8, textAlign: "center" },
  safetyBlock: { backgroundColor: "#FFF8E5", borderRadius: 12, padding: 16 },
  safetyTitle: { fontWeight: "700", color: "#1A1A1A", marginBottom: 6 },
  safetyText: { fontSize: 13, color: "#555", lineHeight: 19 },
});
