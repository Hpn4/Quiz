import React from "react";
import { View, StyleSheet } from "react-native";

import { useSession } from "@/types/SessionContext";
import colors from "@/constants/Color";

const ProgressBar: React.FC = () => {
  const { session } = useSession();

  if (!session || session.pool.length === 0) return null;

  const { pool, currentIndex, answers } = session;
  const count = pool.length;

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => {
        const isCurrent = index === currentIndex;
        const color =
          answers[index] === undefined
            ? isCurrent
              ? colors.accentuation
              : colors.card
            : answers[index] === true
            ? colors.green
            : colors.red;

        const borderStyle =
          index === 0
            ? styles.segment0
            : index === count - 1
            ? styles.segment1
            : {};

        return (
          <View
            key={index}
            style={[styles.segment, borderStyle, { backgroundColor: color }]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.stroke,
    boxShadow: "5px 5px 10px #000",
  },
  segment: {
    flex: 1,
    height: 18,
    borderRightWidth: 1,
    opacity: 0.9,
    borderColor: colors.stroke,
  },
  segment0: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  segment1: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderRightWidth: 0,
  },
});

export default ProgressBar;

