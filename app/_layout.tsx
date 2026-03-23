import { Stack, useSegments } from "expo-router";
import { View, StatusBar, StyleSheet } from "react-native";

import { SessionProvider } from "@/types/SessionContext";
import { ThemeProvider, useTheme, useThemeColors } from "@/types/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AppNavigation />
      </SessionProvider>
    </ThemeProvider>
  );
}

function AppNavigation() {
  const colors = useThemeColors();
  const { theme } = useTheme();
  const segments = useSegments();
  const isHomeRoot = segments.length === 1 && segments[0] === "(tabs)";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      {!isHomeRoot ? <View style={[styles.circle, { backgroundColor: colors.accentuation }]} /> : null}
      <View style={[styles.main, !isHomeRoot && styles.mainOffset]}>
        <Stack
          screenOptions={{
            headerShown: false,
            navigationBarColor: colors.background,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    flex: 1,
    backgroundColor: "transparent",
  },
  mainOffset: {
    marginTop: 30,
  },
  circle: {
    left: "0%",
    position: "absolute",
    top: -15,
    width: "100%",
    height: 40,
    zIndex: -1,
    borderBottomLeftRadius: "100%",
    borderBottomRightRadius: "100%",
  },
});
