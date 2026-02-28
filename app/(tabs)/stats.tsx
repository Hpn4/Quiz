import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useSession } from "@/types/SessionContext";
import { getAllQuizList, getQuiz, getTopic } from "@/types/Data";
import { statsKey } from "@/utils/statsStorage";
import colors from "@/constants/Color";

function fmtDate(ts: number | null): string {
  if (!ts) return "Jamais";
  const d = new Date(ts);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function AccuracyBar({ value }: { value: number }) {
  const color =
    value >= 70 ? colors.green : value >= 40 ? "#F5A623" : colors.red;
  return (
    <View style={bar.track}>
      <View style={[bar.fill, { width: `${value}%` as any, backgroundColor: color }]} />
    </View>
  );
}

const bar = StyleSheet.create({
  track: {
    height: 5,
    borderRadius: 4,
    backgroundColor: colors.stroke,
    overflow: "hidden",
    flex: 1,
  },
  fill: {
    height: 5,
    borderRadius: 4,
  },
});

export default function StatsScreen() {
  const { stats, statsLoaded } = useSession();
  const quizList = useMemo(() => getAllQuizList(), []);

  const { global, byTopic } = useMemo(() => {
    let totalSeen = 0;
    let totalCorrect = 0;
    let totalAttempts = 0;

    type QuizRow = {
      quizSlug: string;
      quizName: string;
      totalQ: number;
      seenQ: number;
      attempts: number;
      correct: number;
      accuracy: number;
      lastSeen: number | null;
    };

    const topicMap: Record<
      string,
      { topicName: string; rows: QuizRow[] }
    > = {};

    for (const { topicSlug, quizSlug } of quizList) {
      const key = statsKey(topicSlug, quizSlug);
      const quizStats = stats[key] ?? [];
      const quiz = getQuiz(topicSlug, quizSlug);
      const topic = getTopic(topicSlug);

      const totalQ = quiz?.questions?.length ?? 0;
      const seenQ = quizStats.filter((s) => s.seenCount > 0).length;
      const attempts = quizStats.reduce((a, s) => a + s.seenCount, 0);
      const correct = quizStats.reduce((a, s) => a + s.correctCount, 0);
      const accuracy = attempts === 0 ? 0 : Math.round((correct / attempts) * 100);
      const lastSeen = quizStats.reduce<number | null>((best, s) => {
        if (s.lastSeen === null) return best;
        return best === null || s.lastSeen > best ? s.lastSeen : best;
      }, null);

      totalSeen += seenQ;
      totalCorrect += correct;
      totalAttempts += attempts;

      if (!topicMap[topicSlug]) {
        topicMap[topicSlug] = { topicName: topic?.name ?? topicSlug, rows: [] };
      }
      topicMap[topicSlug].rows.push({
        quizSlug,
        quizName: quiz?.name ?? quizSlug,
        totalQ,
        seenQ,
        attempts,
        correct,
        accuracy,
        lastSeen,
      });
    }

    const globalAccuracy =
      totalAttempts === 0
        ? null
        : Math.round((totalCorrect / totalAttempts) * 100);

    return {
      global: { totalSeen, totalAttempts, globalAccuracy },
      byTopic: topicMap,
    };
  }, [stats]);

  if (!statsLoaded) {
    return (
      <View style={styles.root}>
        <Text style={styles.loading}>Chargement…</Text>
      </View>
    );
  }

  const neverPracticed = global.totalAttempts === 0;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Statistiques</Text>

        <View style={styles.card}>
          <View style={styles.globalRow}>
            <View style={styles.globalStat}>
              <Text style={[styles.bigNum, neverPracticed && styles.dimmed]}>
                {neverPracticed ? "—" : `${global.globalAccuracy}%`}
              </Text>
              <Text style={styles.bigLbl}>Précision globale</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.globalStat}>
              <Text style={[styles.bigNum, neverPracticed && styles.dimmed]}>
                {global.totalSeen}
              </Text>
              <Text style={styles.bigLbl}>Questions vues</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.globalStat}>
              <Text style={[styles.bigNum, neverPracticed && styles.dimmed]}>
                {global.totalAttempts}
              </Text>
              <Text style={styles.bigLbl}>Réponses données</Text>
            </View>
          </View>
          {!neverPracticed && (
            <View style={styles.globalBarWrap}>
              <AccuracyBar value={global.globalAccuracy ?? 0} />
            </View>
          )}
        </View>

        {Object.entries(byTopic).map(([topicSlug, { topicName, rows }]) => (
          <View key={topicSlug} style={styles.section}>
            <Text style={styles.sectionTitle}>{topicName}</Text>

            <View style={styles.card}>
              {rows.map((row, idx) => {
                const untouched = row.attempts === 0;
                return (
                  <View key={row.quizSlug}>
                    {idx > 0 && <View style={styles.rowDivider} />}
                    <View style={styles.quizRow}>
                      {/* Name + last seen */}
                      <View style={styles.quizLeft}>
                        <Text
                          style={[styles.quizName, untouched && styles.dimmed]}
                          numberOfLines={1}
                        >
                          {row.quizName}
                        </Text>
                        <Text style={styles.quizSub}>
                          {untouched
                            ? "Pas encore pratiqué"
                            : `Dernière fois : ${fmtDate(row.lastSeen)}`}
                        </Text>
                      </View>

                      {/* Accuracy + seen count */}
                      <View style={styles.quizRight}>
                        <Text
                          style={[
                            styles.pctText,
                            !untouched && {
                              color:
                                row.accuracy >= 70
                                  ? colors.green
                                  : row.accuracy >= 40
                                  ? "#F5A623"
                                  : colors.red,
                            },
                            untouched && styles.dimmed,
                          ]}
                        >
                          {untouched ? "—" : `${row.accuracy}%`}
                        </Text>
                        <Text style={styles.seenCount}>
                          {row.seenQ}/{row.totalQ} vues
                        </Text>
                      </View>
                    </View>

                    {/* Accuracy bar (hidden if untouched) */}
                    {!untouched && (
                      <View style={styles.barWrap}>
                        <AccuracyBar value={row.accuracy} />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  loading: {
    color: "#888",
    textAlign: "center",
    marginTop: 60,
    fontSize: 15,
  },
  pageTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.stroke,
    overflow: "hidden",
  },
  globalRow: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  globalStat: {
    alignItems: "center",
    flex: 1,
  },
  bigNum: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
  },
  bigLbl: {
    color: "#777",
    fontSize: 11,
    marginTop: 3,
    fontWeight: "500",
    textAlign: "center",
  },
  cardDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.stroke,
  },
  globalBarWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: "#666",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.stroke,
    marginHorizontal: 16,
  },
  quizRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 12,
  },
  quizLeft: {
    flex: 1,
  },
  quizName: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  quizSub: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  quizRight: {
    alignItems: "flex-end",
    minWidth: 64,
  },
  pctText: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
  },
  seenCount: {
    color: "#666",
    fontSize: 11,
    marginTop: 2,
  },
  barWrap: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  dimmed: {
    color: "#444",
  },
});

