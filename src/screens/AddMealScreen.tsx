import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import { analyzeDishPhoto } from "../services/aiService";
import { MEAL_TYPE_LABELS, MealEntry, MealType } from "../types";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

function emptyForm() {
  return { name: "", weight_g: "", kcal: "", protein_g: "", fat_g: "", carbs_g: "" };
}

export default function AddMealScreen() {
  const { addMeal } = useAppContext();

  const [type, setType] = useState<MealType>("breakfast");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [note, setNote] = useState<string | undefined>();
  const [form, setForm] = useState(emptyForm());

  const setField = (key: keyof ReturnType<typeof emptyForm>, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Нет доступа", "Разрешите доступ к камере/галерее в настройках.");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.6 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });

    if (result.canceled || !result.assets?.length) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);
    await runAnalysis(uri);
  };

  const runAnalysis = async (uri: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDishPhoto(uri);
      setForm({
        name: analysis.name,
        weight_g: String(analysis.weight_g),
        kcal: String(analysis.kcal),
        protein_g: String(analysis.protein_g),
        fat_g: String(analysis.fat_g),
        carbs_g: String(analysis.carbs_g),
      });
      setNote(analysis.note);
    } catch (e) {
      Alert.alert("Ошибка анализа", "Не удалось проанализировать фото. Заполните данные вручную.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    const weight_g = Number(form.weight_g);
    const kcal = Number(form.kcal);
    const protein_g = Number(form.protein_g);
    const fat_g = Number(form.fat_g);
    const carbs_g = Number(form.carbs_g);

    if (!form.name.trim() || !kcal) {
      Alert.alert("Заполните данные", "Укажите хотя бы название и калории.");
      return;
    }

    const now = new Date();
    const entry: MealEntry = {
      id: `${now.getTime()}`,
      type,
      name: form.name.trim(),
      weight_g: weight_g || 0,
      kcal,
      protein_g: protein_g || 0,
      fat_g: fat_g || 0,
      carbs_g: carbs_g || 0,
      note,
      date: now.toISOString().slice(0, 10),
      createdAt: now.toISOString(),
    };

    await addMeal(entry);

    setForm(emptyForm());
    setImageUri(null);
    setNote(undefined);
    Alert.alert("Добавлено", "Приём пищи сохранён в дневнике.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Добавить приём пищи</Text>

      <Text style={styles.label}>Тип приёма</Text>
      <View style={styles.row}>
        {MEAL_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, type === t && styles.chipActive]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.chipText, type === t && styles.chipTextActive]}>
              {MEAL_TYPE_LABELS[t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Фото блюда</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(true)}>
          <Text style={styles.photoButtonText}>Камера</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(false)}>
          <Text style={styles.photoButtonText}>Галерея</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      {isAnalyzing && (
        <View style={styles.analyzingRow}>
          <ActivityIndicator color="#34C759" />
          <Text style={styles.analyzingText}>AI анализирует блюдо…</Text>
        </View>
      )}

      {note && <Text style={styles.note}>Примечание AI: {note}</Text>}

      <Text style={styles.sectionTitle}>Данные о блюде</Text>

      <Text style={styles.label}>Название</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={(v) => setField("name", v)} placeholder="Например, куриный суп" />

      <Text style={styles.label}>Вес порции (г)</Text>
      <TextInput style={styles.input} value={form.weight_g} onChangeText={(v) => setField("weight_g", v)} keyboardType="numeric" />

      <Text style={styles.label}>Калории (ккал)</Text>
      <TextInput style={styles.input} value={form.kcal} onChangeText={(v) => setField("kcal", v)} keyboardType="numeric" />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Белки (г)</Text>
          <TextInput style={styles.input} value={form.protein_g} onChangeText={(v) => setField("protein_g", v)} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Жиры (г)</Text>
          <TextInput style={styles.input} value={form.fat_g} onChangeText={(v) => setField("fat_g", v)} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Углеводы (г)</Text>
          <TextInput style={styles.input} value={form.carbs_g} onChangeText={(v) => setField("carbs_g", v)} keyboardType="numeric" />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Добавить в дневник</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 12, marginBottom: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 20, marginBottom: 6, color: "#1A1A1A" },
  row: { flexDirection: "row", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 8,
  },
  chipActive: { backgroundColor: "#34C759", borderColor: "#34C759" },
  chipText: { color: "#333", fontSize: 13 },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  photoButton: {
    flex: 1,
    backgroundColor: "#F0F0F2",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  photoButtonText: { fontWeight: "600", color: "#1A1A1A" },
  preview: { width: "100%", height: 200, borderRadius: 12, marginTop: 12 },
  analyzingRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  analyzingText: { color: "#555" },
  note: { marginTop: 10, fontSize: 12, color: "#888", fontStyle: "italic" },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
