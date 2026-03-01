import { useLocalSearchParams, useRouter, usePathname } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

import { Quiz } from "@/types/Quiz";
import { FlatQuestion } from "@/types/Session";
import { getQuiz, getQuizFlatQuestions } from "@/types/Data";
import { useSession } from "@/types/SessionContext";
import { statsKey } from "@/utils/statsStorage";

import GlossaryBox from "@/components/GlossaryBox";
import TitleCard from "@/components/TitleCard";
import StartModal from "@/components/StartModal";
import StartButton from "@/components/StartButton";

import colors from "@/constants/Color";
import gStyles from "@/constants/GlobalStyle";

export default function Index() {
  const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const local = useLocalSearchParams();
  const topicSlug = String(local.topic_slug);
  const quizSlug = String(local.quiz_slug);
  const { startSession, clearSession, stats } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useFocusEffect(
    React.useCallback(() => {
      clearSession();
    }, [])
  );

  useEffect(() => {
    setQuiz(getQuiz(topicSlug, quizSlug));
  }, []);

  const quizQuestions = useMemo(
    () => getQuizFlatQuestions(topicSlug, quizSlug),
    [topicSlug, quizSlug]
  );

  const quizStatsKey = statsKey(topicSlug, quizSlug);
  const quizStats = stats[quizStatsKey] ?? [];

  const handleStart = (count: number, allowCasClinique: boolean) => {
    setModalVisible(false);
    startSession(quizQuestions, count, allowCasClinique, pathname);
    router.push("/session/0");
  };

  const handleStartSingleQuestion = (fq: FlatQuestion) => {
    startSession([fq], 1, true, pathname, true);
    router.push("/session/0");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TitleCard title={quiz?.name ?? ""} content={quiz?.description ?? ""} infoTable={quiz?.infoTable}/>
        <GlossaryBox items={quiz?.glossary} />

        {/* Question list */}
        {quizQuestions.length > 0 && (
          <View style={[gStyles.card, styles.questionListCard]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Questions</Text>
            </View>
            {quizQuestions.map((fq, idx) => {
              const stat = quizStats.find((s) =>
                fq.question?.id ? s.id === fq.question.id : s.questionIndex === fq.questionIndex
              );
              const correct = stat?.correctCount ?? 0;
              const seen = stat?.seenCount ?? 0;
              const last = stat?.lastSeen ?? null;
              const fmtLast = last
                ? new Date(last).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                : "Jamais";
              const desc = fq.question?.description ?? "";
              const shortDesc = desc.length > 100 ? desc.slice(0, 100) + "…" : desc;

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleStartSingleQuestion(fq)}
                  style={[styles.questionRow, idx < quizQuestions.length - 1 && styles.questionRowBorder]}
                >
                  <View style={styles.questionInfo}>
                    <Text style={styles.questionTitle} numberOfLines={2}>
                      {fq.question?.title ?? `Question ${idx + 1}`}
                    </Text>
                    {shortDesc ? (
                      <Text style={styles.questionDesc} numberOfLines={2}>{shortDesc}</Text>
                    ) : null}
                  </View>
                  <View style={styles.questionStatsCol}>
                    <View style={styles.questionStatsRow}>
                      <Text style={{ color: colors.green, fontSize: 13, fontWeight: '700' }}>{correct}</Text>
                      <Text style={{ color: '#999', fontSize: 13 }}>/</Text>
                      <Text style={{ color: '#999', fontSize: 13 }}>{seen}</Text>
                    </View>
                    <Text style={styles.questionLast}>{fmtLast}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <StartButton onPress={() => setModalVisible(true)} bottomOffset={100} />

      <StartModal
        visible={modalVisible}
        maxQuestions={quizQuestions.length}
        onConfirm={handleStart}
        onClose={() => setModalVisible(false)}
        defaultAllowCasClinique={false}
        scope={quizQuestions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 100,
  },
  questionListCard: {
    margin: 15,
    marginBottom: 15,
    paddingBottom: 0,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  sectionHeader: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingVertical: 8,
    borderColor: colors.stroke,
    width: '100%',
    backgroundColor: colors.title,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '100%',
    gap: 10,
  },
  questionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  questionInfo: {
    flex: 1,
    gap: 4,
  },
  questionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  questionDesc: {
    color: '#999',
    fontSize: 13,
  },
  questionStatsCol: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 50,
  },
  questionStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  questionLast: {
    color: '#666',
    fontSize: 10,
  },
});

