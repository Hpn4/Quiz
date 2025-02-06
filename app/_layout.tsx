import { Stack } from "expo-router";
import { View, StatusBar, StyleSheet } from "react-native";

import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

export default function RootLayout() {
  return (
    <>
    <View style={gStyles.container}>
      <StatusBar backgroundColor={colors.accentuation}/>
      <View style={styles.circle}/>
      <View style={styles.main}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)"/>
      </Stack>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  circle: {
    left: "-5%",
    top: -130,
    width: "110%",
    height: 200,
    marginBottom: -120,
    borderBottomLeftRadius: "50%",
    borderBottomRightRadius: "50%",
    backgroundColor: colors.accentuation,
  },
  main: {
    flex: 1,
    backgroundColor: "transparent",
  }
});
