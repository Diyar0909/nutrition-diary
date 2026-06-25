import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import { calculateNorms } from "../utils/calculations";
import {
  ACTIVITY_LEVEL_LABELS,
  ActivityLevel,
  Gender,
  Goal,
  GOAL_LABELS,
  UserProfile,
} from "../types";

const ACTIVITY_LEVELS: ActivityLevel[] = [1, 2, 3, 4, 5];
const GOALS: Goal[] = ["lose", "maintain", "gain"];

export default function ProfileScreen() {
  const { profile, updateProfile } = useAppContext();

  const [gender, setGender] = useState<Gender>(profile?.gender ?? "male");
  const [age, setAge] = useState(profile?.age?.toString() ?? "");
  const [weight, setWeight] = useState(profile?.weight?.toString() ?? "");
  const [height, setHeight] = useState(profile?.height?.toString() ?? "");
  const [targetWeight, setTargetWeight] = useState(
    profile?.targetWeight?.toString() ?? ""
  );
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? "maintain");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile?.activityLevel ?? 3
  );

  const handleSave = async () => {
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    const targetWeightNum = Number(targetWeight);

    if (!ageNum || !weightNum || !heightNum || !targetWeightNum) {
      Alert.alert("Заполните все поля", "Проверьте корректность введённых чисел.");
      return;
    }

    const next: UserProfile = {
      gender,
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      targetWeight: targetWeightNum,
      goal,
      activityLevel,
    };

    await updateProfile(next);
  };

  const previewNorms = (() => {
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    if (!ageNum || !weightNum || !heightNum) return null;
    return calculateNorms({
      gender,
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      targetWeight: Number(targetWeight) || weightNum,
      goal,
      activityLevel,
    });
  })();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Профиль</Text>
      <Text style={styles.subtitle}>
        Заполните данные, чтобы рассчитать норму калорий и БЖУ
      </Text>

      <Text style={styles.label}>Пол</Text>
      <View style={styles.row}>
        {(["male", "female"] as Gender[]).map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, gender === g && styles.chipActive]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>
              {g === "male" ? "Мужской" : "Женский"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Возраст (лет)</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Текущий вес (кг)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Рост (см)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Целевой вес (кг)</Text>
      <TextInput
        style={styles.input}
        value={targetWeight}
        onChangeText={setTargetWeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Цель</Text>
      <View style={styles.row}>
        {GOALS.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, goal === g && styles.chipActive]}
            onPress={() => setGoal(g)}
          >
            <Text style={[styles.chipText, goal === g && styles.chipTextActive]}>
              {GOAL_LABELS[g]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Физическая активность</Text>
      <View style={styles.wrapRow}>
        {ACTIVITY_LEVELS.map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.chip, activityLevel === lvl && styles.chipActive]}
            onPress={() => setActivityLevel(lvl)}
          >
            <Text
              style={[styles.chipText, activityLevel === lvl && styles.chipTextActive]}
            >
              {ACTIVITY_LEVEL_LABELS[lvl]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {previewNorms && (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Расчётная норма</Text>
          <Text style={styles.previewLine}>Калории: {previewNorms.kcal} ккал/день</Text>
          <Text style={styles.previewLine}>Белки: {previewNorms.protein_g} г</Text>
          <Text style={styles.previewLine}>Жиры: {previewNorms.fat_g} г</Text>
          <Text style={styles.previewLine}>Углеводы: {previewNorms.carbs_g} г</Text>
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Сохранить и продолжить</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: "700", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  row: { flexDirection: "row", gap: 8 },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 8,
  },
  chipActive: { backgroundColor: "#34C759", borderColor: "#34C759" },
  chipText: { color: "#333", fontSize: 13 },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  preview: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#F2F8F2",
    borderRadius: 12,
  },
  previewTitle: { fontWeight: "700", marginBottom: 6, color: "#1A1A1A" },
  previewLine: { color: "#333", fontSize: 14, marginBottom: 2 },
  saveButton: {
    marginTop: 28,
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
