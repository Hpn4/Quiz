import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useTheme, useThemeColors } from "@/types/ThemeContext";

export default function HomeHeader() {
  const colors = useThemeColors();
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.stroke }]}>
      <View style={styles.leftGroup}>
        <FontAwesome6 name="book-medical" size={18} color={colors.text} />
        <Text style={[styles.title, { color: colors.text }]}>Sémio'stéo</Text>
      </View>

      <Pressable
        onPress={toggleTheme}
        style={[styles.themeButton, { backgroundColor: colors.title, borderColor: colors.stroke }]}
      >
        <FontAwesome6
          name={theme === "dark" ? "sun" : "moon"}
          size={16}
          color={colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
