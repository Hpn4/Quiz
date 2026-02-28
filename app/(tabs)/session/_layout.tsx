import React from "react";
import { Stack } from "expo-router";
import colors from "@/constants/Color";

export default function SessionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
      }}
    />
  );
}
