import { View, StyleSheet } from "react-native";

import colors from "@/constants/Color"
import TitleCard from "@/components/TitleCard";

export default function Index() {
  return (
    <View style={styles.container}>
      <TitleCard title={"Statistiques"} content={"Flemme"}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
