import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";

import type { ThemeColors } from "@/constants/Color";
import { FlatQuestion } from "@/types/Session";
import { useThemeColors, useThemedStyles } from "@/types/ThemeContext";

interface StartSheetProps {
  visible: boolean;
  maxQuestions: number;
  /** Called immediately when the user taps a count pill. */
  onConfirm: (count: number, allowCasClinique: boolean) => void;
  /** Default value for allowing "cas clinique" text questions when the modal opens. */
  defaultAllowCasClinique?: boolean;
  scope?: FlatQuestion[];
  onClose: () => void;
}

const COUNTS = [5, 10, 15, 20, 30];

const StartSheet: React.FC<StartSheetProps> = ({
  visible,
  maxQuestions,
  onConfirm,
  defaultAllowCasClinique = true,
  scope,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: Platform.OS !== 'web',
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [visible]);

  // Standard counts that are strictly less than max, plus an "all" pill
  const pillsFor = (count: number) => COUNTS.filter((c) => c < count);

  const [allowCasClinique, setAllowCasClinique] = React.useState<boolean>(defaultAllowCasClinique);

  // Keep internal default in sync if prop changes
  React.useEffect(() => setAllowCasClinique(defaultAllowCasClinique), [defaultAllowCasClinique]);

  // compute available question count considering the optional scope
  const computeAvailableCount = (allow: boolean) => {
    if (!scope || scope.length === 0) return maxQuestions;
    if (allow) return scope.length;
    return scope.filter((fq) => !(fq.question?.type === "text")).length;
  };

  const availableCount = computeAvailableCount(allowCasClinique);
  const pills = pillsFor(availableCount);

  // Keep internal default in sync if prop changes
  React.useEffect(() => setAllowCasClinique(defaultAllowCasClinique), [defaultAllowCasClinique]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop – tap to dismiss */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sliding sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.handle} />
        <Text style={styles.title}>Nombre de questions</Text>

        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Inclure les cas clinique</Text>
          <TouchableOpacity onPress={() => setAllowCasClinique((v) => !v)}>
            <View style={[styles.checkbox, { backgroundColor: allowCasClinique ? colors.accentuation : colors.card, borderColor: colors.stroke }]}>
              <Text style={{ color: colors.text, fontWeight: "100", fontSize: 25 }}>{allowCasClinique ? "x" : ""}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.pillRow}>
          {pills.map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.pill}
              onPress={() => onConfirm(c, allowCasClinique)}
              activeOpacity={0.75}
            >
              <Text style={styles.pillText}>{c}</Text>
            </TouchableOpacity>
          ))}
          {/* "All" pill */}
          <TouchableOpacity
            style={[styles.pill, styles.pillAll]}
            onPress={() => onConfirm(availableCount, allowCasClinique)}
            activeOpacity={0.75}
          >
            <Text style={styles.pillText}>{`Tout (${availableCount})`}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default StartSheet;

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: `${colors.shadow}BB`,
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
    color: colors.text,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 18,
    textAlign: "center",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 6,
    paddingBottom: 18,
  },
  optionText: {
    color: colors.text,
    fontSize: 18,
    flex: 1,
    paddingRight: 10,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    backgroundColor: colors.accentuation,
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 30,
    minWidth: 70,
    alignItems: "center",
  },
  pillAll: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.accentuation,
  },
  pillText: {
    color: colors.text,
    fontWeight: "bold",
    paddingTop: 5,
    fontSize: 18,
  },
});
