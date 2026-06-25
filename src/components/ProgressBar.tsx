import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color: string;
}

export default function ProgressBar({ label, current, target, unit = "г", color }: Props) {
  const ratio = target > 0 ? Math.min(current / target, 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {Math.round(current)} / {Math.round(target)} {unit}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#333" },
  value: { fontSize: 13, color: "#666" },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E5E5EA",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 5 },
});
