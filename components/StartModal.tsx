import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from "react-native";

import colors from "@/constants/Color";

interface StartSheetProps {
  visible: boolean;
  maxQuestions: number;
  /** Called immediately when the user taps a count pill. */
  onConfirm: (count: number) => void;
  onClose: () => void;
}

const COUNTS = [5, 10, 15, 20, 30];

const StartSheet: React.FC<StartSheetProps> = ({
  visible,
  maxQuestions,
  onConfirm,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Standard counts that are strictly less than max, plus an "all" pill
  const pills = COUNTS.filter((c) => c < maxQuestions);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop – tap to dismiss */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sliding sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.handle} />
        <Text style={styles.title}>Nombre de questions</Text>

        <View style={styles.pillRow}>
          {pills.map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.pill}
              onPress={() => onConfirm(c)}
              activeOpacity={0.75}
            >
              <Text style={styles.pillText}>{c}</Text>
            </TouchableOpacity>
          ))}
          {/* "All" pill */}
          <TouchableOpacity
            style={[styles.pill, styles.pillAll]}
            onPress={() => onConfirm(maxQuestions)}
            activeOpacity={0.75}
          >
            <Text style={styles.pillText}>Tout ({maxQuestions})</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default StartSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 16,
    left: "20%",
    right: "20%",
    backgroundColor: colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.stroke,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.stroke,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 18,
    textAlign: "center",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  pill: {
    backgroundColor: colors.accentuation,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
    minWidth: 64,
    alignItems: "center",
  },
  pillAll: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.accentuation,
  },
  pillText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
