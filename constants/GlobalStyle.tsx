import { StyleSheet } from "react-native";

import colors from "@/constants/Color"

const gStyles = StyleSheet.create({
  card: {
  	backgroundColor: colors.card,
    borderColor: colors.stroke,
    borderWidth: 1,
    borderRadius: 10,
    boxShadow: "5px 5px 10px #000",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  text: {
  	fontSize: 20,
  	color: colors.text,
  }
});

export default gStyles;