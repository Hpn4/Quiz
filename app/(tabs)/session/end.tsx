import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { useSession } from "@/types/SessionContext";
import colors from "@/constants/Color";
import { playPerfect } from "@/utils/sounds";

export default function SessionEnd() {
  const { session, finishSession, clearSession } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  // Capture returnPath before session is cleared.
  const returnPath = session?.returnPath;

  const answers = session?.answers ?? [];
  const total = answers.length;
  const correct = answers.filter((a) => a === true).length;
  const wrong = answers.filter((a) => a === false).length;
  const percent = total === 0 ? 0 : (correct / total) * 100;

  useEffect(() => {
    if (!saved) {
      setSaved(true);
      finishSession();
      if (percent === 100) playPerfect();
    }
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroRow}>
          <AnimatedCircularProgress
            size={160}
            width={14}
            fill={percent}
            lineCap="round"
            tintColor={colors.accentuation}
            backgroundColor={colors.card}
            rotation={0}
          >
            {() => (
              <Text style={styles.pct}>{Math.round(percent)}%</Text>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.counters}>
          <View style={styles.counter}>
            <Text style={[styles.counterNum, { color: colors.green }]}>
              {correct}
            </Text>
            <Text style={styles.counterLbl}>Correctes</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.counter}>
            <Text style={[styles.counterNum, { color: colors.red }]}>
              {wrong}
            </Text>
            <Text style={styles.counterLbl}>Incorrectes</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.counter}>
            <Text style={[styles.counterNum, { color: "white" }]}>
              {total}
            </Text>
            <Text style={styles.counterLbl}>Total</Text>
          </View>
        </View>

        <Text style={styles.stripLabel}>Détail</Text>
        <View style={styles.strip}>
          {answers.map((a, i) => (
            <View
              key={i}
              style={[
                styles.tile,
                {
                  backgroundColor:
                    a === true
                      ? colors.green_a
                      : a === false
                      ? colors.red_a
                      : colors.card,
                  borderColor:
                    a === true
                      ? colors.green
                      : a === false
                      ? colors.red
                      : colors.stroke,
                },
              ]}
            >
              <Text
                style={[
                  styles.tileNum,
                  {
                    color:
                      a === true
                        ? colors.green
                        : a === false
                        ? colors.red
                        : "#666",
                  },
                ]}
              >
                {i + 1}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        {returnPath ? (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              clearSession();
              router.navigate(returnPath as any);
            }}
          >
            <Text style={styles.primaryTxt}>Retour</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => {
            clearSession();
            router.replace("/(tabs)/");
          }}
        >
          <Text style={styles.secondaryTxt}>Accueil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  heroRow: {
    marginBottom: 36,
  },
  pct: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  counters: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.stroke,
    paddingVertical: 20,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: 36,
    alignItems: "center",
    justifyContent: "space-around",
  },
  counter: {
    alignItems: "center",
    flex: 1,
  },
  counterNum: {
    fontSize: 32,
    fontWeight: "800",
  },
  counterLbl: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.stroke,
  },
  stripLabel: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  strip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-start",
    width: "100%",
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tileNum: {
    fontSize: 13,
    fontWeight: "700",
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 10,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  secondaryTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: colors.accentuation,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

