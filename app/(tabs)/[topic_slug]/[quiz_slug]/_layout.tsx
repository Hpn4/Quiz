import React from "react";
import { Stack } from "expo-router";
import { QuizProvider } from "@/types/QuizContext";

import colors from "@/constants/Color"

export default function Layout() {
  return (
    <QuizProvider>
      <Stack screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background
      }}/>
    </QuizProvider>
  );
}