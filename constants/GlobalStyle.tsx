import { StyleSheet } from "react-native";

import { darkColors, ThemeColors } from "@/constants/Color";
import { useThemedStyles } from "@/types/ThemeContext";

const createGlobalStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.stroke,
      borderWidth: 1,
      borderRadius: 10,
      boxShadow: `5px 5px 10px ${colors.shadow}`,
      elevation: 5,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      overflow: "hidden",
    },
    text: {
      fontSize: 20,
      color: colors.text,
    },
  });

export const useGlobalStyles = () => useThemedStyles(createGlobalStyles);

const gStyles = createGlobalStyles(darkColors);

export default gStyles;