import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet } from "react-native";

import { Quiz } from "@/types/Quiz";
import { getQuiz, getQuizFlatQuestions } from "@/types/Data";
import { useSession } from "@/types/SessionContext";

import GlossaryBox from "@/components/GlossaryBox";
import TitleCard from "@/components/TitleCard";
import StartModal from "@/components/StartModal";
import StartButton from "@/components/StartButton";

import colors from "@/constants/Color";

export default function Index() {
  const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const local = useLocalSearchParams();
  const topicSlug = String(local.topic_slug);
  const quizSlug = String(local.quiz_slug);
  const { startSession, clearSession } = useSession();
  const router = useRouter();

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

  const handleStart = (count: number) => {
    setModalVisible(false);
    startSession(quizQuestions, count);
    router.push("/session/0");
  };

  return (
    <View style={styles.container}>
      <TitleCard title={quiz?.name ?? ""} content={quiz?.description ?? ""} infoTable={quiz?.infoTable}/>
      <GlossaryBox items={quiz?.glossary} />

      <StartButton onPress={() => setModalVisible(true)} bottomOffset={100} />

      <StartModal
        visible={modalVisible}
        maxQuestions={quizQuestions.length}
        onConfirm={handleStart}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80, // Nav bar
    backgroundColor: colors.background,
  },
});
