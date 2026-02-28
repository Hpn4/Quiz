import { Stack } from "expo-router";
import { View, StatusBar, StyleSheet } from "react-native";

import { SessionProvider } from "@/types/SessionContext";
import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

export default function RootLayout() {
  return (
    <SessionProvider>
    <>
    <View style={gStyles.container}>
      <StatusBar backgroundColor={colors.accentuation}/>
      <View style={styles.circle}/>
      <View style={styles.main}>
      <Stack screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background
      }}>
        <Stack.Screen name="(tabs)"/>
      </Stack>
      </View>
    </View>
    </>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  circle: {
    left: "0%",
    position: "absolute",
    top: -15,
    width: "100%",
    height: 40,
    zIndex: -1,
    borderBottomLeftRadius: "100%",
    borderBottomRightRadius: "100%",
    backgroundColor: colors.accentuation,
  },
  main: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "transparent",
  }
});
