import { useLocalSearchParams, useRouter, usePathname } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet } from "react-native";

import { Quiz } from "@/types/Quiz";
import { FlatQuestion } from "@/types/Session";
import { getQuiz, getQuizFlatQuestions } from "@/types/Data";
import { useSession } from "@/types/SessionContext";
import { statsKey } from "@/utils/statsStorage";

import GlossaryBox from "@/components/GlossaryBox";
import TitleCard from "@/components/TitleCard";
import StartModal from "@/components/StartModal";
import StartButton from "@/components/StartButton";
import QuizQuestions from '@/components/QuizQuestions';

import type { ThemeColors } from "@/constants/Color";
import { useThemedStyles } from "@/types/ThemeContext";

export default function Index() {
  const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const local = useLocalSearchParams();
  const topicSlug = String(local.topic_slug);
  const quizSlug = String(local.quiz_slug);
  const { startSession, clearSession, stats } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const styles = useThemedStyles(createStyles);

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
          <QuizQuestions
            quizQuestions={quizQuestions}
            quizStats={quizStats}
            onStartSingleQuestion={handleStartSingleQuestion}
          />
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 100,
  },
});


