import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from 'expo-router';

import { View, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import colors from "@/constants/Color"
import { GenericCard } from "@/components/TitleCard";
import MdText from '@/components/Markdown';

import { Quiz } from "@/types/Quiz";
import { getQuiz } from "@/types/Data";
import { useQuiz } from "@/types/QuizContext";

export default function Index() {
  const [questionsCount, setQuestionsCount] = useState(0);
  const { quizState } = useQuiz();
  const { score, answers } = quizState;
  const local = useLocalSearchParams();

  useEffect(() => {
    const topicSlug = String(local.topic_slug);
    const quizSlug = String(local.quiz_slug);
    var quiz = getQuiz(topicSlug, quizSlug);
    setQuestionsCount(quiz?.questions?.length ?? 0);
  }, []);

  return (
    <View style={styles.container}>
      <GenericCard title={"Fin"}>

      <MdText content="Petit texte"/>

      <AnimatedCircularProgress
        size={150}
        width={15}
        fill={questionsCount == 0 ? 0 : (score / questionsCount) * 100}
        lineCap="round"
        tintColor={colors.accentuation}
        backgroundColor={colors.card}>
        {
          (fill) => (
            <Text style={{color: "white"}}>
            {Math.round(fill * 100) / 100}%
            </Text>
          )
        }
      </AnimatedCircularProgress>
      </GenericCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
