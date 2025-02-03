import { Stack } from "expo-router";
import { View, StatusBar, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <>
    <View style={styles.container}>
      <StatusBar backgroundColor="#842aff"/>
      <View style={styles.circle}/>
      <View style={styles.main}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1919",
  },
  circle: {
    left: "-5%",
    top: -130,
    width: "110%",
    height: 200,
    marginBottom: -120,
    borderBottomLeftRadius: "50%",
    borderBottomRightRadius: "50%",
    backgroundColor: "#842aff",
  },
  main: {
    flex: 1,
    backgroundColor: "transparent",
  }
});
