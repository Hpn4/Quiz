import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "@/constants/Color";

interface StartButtonProps {
  onPress: () => void;
  bottomOffset?: number;
}

const StartButton: React.FC<StartButtonProps> = ({
  onPress,
  bottomOffset = 88,
}) => (
  <TouchableOpacity
    style={[styles.btn, { bottom: bottomOffset }]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Text style={styles.txt}>Commencer</Text>
  </TouchableOpacity>
);

export default StartButton;

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    left: "50%",
    width: 250,
    transform: [{ translateX: -125 }],
    backgroundColor: colors.accentuation,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  txt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.3,
  },
});
