import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import type { ThemeColors } from "@/constants/Color";
import { useThemedStyles } from "@/types/ThemeContext";

interface StartButtonProps {
  onPress: () => void;
  bottomOffset?: number;
}

const StartButton: React.FC<StartButtonProps> = ({
  onPress,
  bottomOffset = 88,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={[styles.btn, { bottom: bottomOffset }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.txt}>Commencer</Text>
    </TouchableOpacity>
  );
};

export default StartButton;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
      boxShadow: `0px 4px 8px ${colors.shadow}59`,
    },
    txt: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: 17,
      letterSpacing: 0.3,
    },
  });
