import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Button, StyleSheet, StatusBar, TouchableOpacity } from "react-native";

import { Quiz } from "@/types/Quiz";
import { getQuiz } from "@/types/Data";
import { useQuiz } from "@/types/QuizContext";

import GlossaryBox from "@/components/GlossaryBox";
import TitleCard from "@/components/TitleCard";

import colors from "@/constants/Color"

export default function Index() {
  const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);
  const local = useLocalSearchParams();
  const topicSlug = String(local.topic_slug);
  const quizSlug = String(local.quiz_slug);
  const { clearQuizState } = useQuiz();

  useFocusEffect(
    React.useCallback(() => {
      clearQuizState();
    }, [])
  );

  useEffect(() => {
    setQuiz(getQuiz(topicSlug, quizSlug));
  }, []);

  return (
    <View style={styles.container}>
      <TitleCard title={quiz?.name ?? ""} content={quiz?.description ?? ""} infoTable={quiz?.infoTable}/>
      <GlossaryBox items={quiz?.glossary} />

      <View style={styles.startWrap}>
        <Link href={{
          pathname: '/[topic_slug]/[quiz_slug]/[question_slug]',
          params: {
            topic_slug: topicSlug,
            quiz_slug: quizSlug,
            question_slug: '0',
          }
        }} asChild>
          <TouchableOpacity>
            <Text style={styles.button}>
              Commencer
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80, // Nav bar
    backgroundColor: colors.background,
  },
  button: {
    marginHorizontal: "30%",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    borderRadius: 30,
    backgroundColor: "#0067C6",
    marginBottom: 20
  }
  ,
  startWrap: {
    marginTop: 'auto',
    marginBottom: 8,
  }
});
