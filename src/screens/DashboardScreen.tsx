import React, { useMemo } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { calculateNorms } from "../utils/calculations";
import ProgressBar from "../components/ProgressBar";
import { MEAL_TYPE_LABELS, MealEntry } from "../types";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardScreen() {
  const { profile, meals, removeMeal } = useAppContext();

  const today = todayISO();
  const todayMeals = useMemo(
    () => meals.filter((m) => m.date === today).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [meals, today]
  );

  const norms = profile ? calculateNorms(profile) : null;

  const totals = useMemo(
    () =>
      todayMeals.reduce(
        (acc, m) => ({
          kcal: acc.kcal + m.kcal,
          protein_g: acc.protein_g + m.protein_g,
          fat_g: acc.fat_g + m.fat_g,
          carbs_g: acc.carbs_g + m.carbs_g,
        }),
        { kcal: 0, protein_g: 0, fat_g: 0, carbs_g: 0 }
      ),
    [todayMeals]
  );

  const handleDelete = (item: MealEntry) => {
    Alert.alert("Удалить приём пищи?", item.name, [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: () => removeMeal(item.id) },
    ]);
  };

  if (!norms) {
    return (
      <View style={styles.center}>
        <Text>Сначала заполните профиль</Text>
      </View>
    );
  }

  const remaining = Math.max(0, norms.kcal - totals.kcal);
  const dateLabel = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{dateLabel}</Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{Math.round(totals.kcal)}</Text>
          <Text style={styles.summaryLabel}>Съедено ккал</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, { color: "#34C759" }]}>{remaining}</Text>
          <Text style={styles.summaryLabel}>Осталось ккал</Text>
        </View>
      </View>

      <View style={styles.progressBlock}>
        <ProgressBar label="Калории" current={totals.kcal} target={norms.kcal} unit="ккал" color="#FF9500" />
        <ProgressBar label="Белки" current={totals.protein_g} target={norms.protein_g} color="#FF3B30" />
        <ProgressBar label="Жиры" current={totals.fat_g} target={norms.fat_g} color="#FFCC00" />
        <ProgressBar label="Углеводы" current={totals.carbs_g} target={norms.carbs_g} color="#007AFF" />
      </View>

      <Text style={styles.sectionTitle}>Приёмы пищи сегодня</Text>
      <FlatList
        data={todayMeals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Пока нет приёмов пищи. Добавьте первый!</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.mealCard} onLongPress={() => handleDelete(item)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealType}>{MEAL_TYPE_LABELS[item.type]}</Text>
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealMacros}>
                {item.weight_g} г · Б {item.protein_g} · Ж {item.fat_g} · У {item.carbs_g}
              </Text>
            </View>
            <Text style={styles.mealKcal}>{item.kcal} ккал</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  date: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", marginBottom: 16, textTransform: "capitalize" },
  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  summaryBox: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  summaryValue: { fontSize: 24, fontWeight: "800", color: "#1A1A1A" },
  summaryLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  progressBlock: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#1A1A1A" },
  empty: { color: "#999", textAlign: "center", marginTop: 20 },
  mealCard: {
    flexDirection: "row",
    backgroundColor: "#F9F9FB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: "center",
  },
  mealType: { fontSize: 12, color: "#888", fontWeight: "600" },
  mealName: { fontSize: 15, fontWeight: "600", color: "#1A1A1A", marginTop: 2 },
  mealMacros: { fontSize: 12, color: "#666", marginTop: 2 },
  mealKcal: { fontSize: 15, fontWeight: "700", color: "#FF9500" },
});
