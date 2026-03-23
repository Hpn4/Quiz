import React from "react";
import { Stack } from "expo-router";
import { useThemeColors } from "@/types/ThemeContext";

export default function TopicLayout() {
  const colors = useThemeColors();

  return (
    <Stack screenOptions={{ headerShown: false, navigationBarColor: colors.background }} />
  );
}
