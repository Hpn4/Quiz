import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Quiz } from "@/types/Quiz";
import { Question } from "@/types/Question";
import { getQuiz } from "@/types/Data";
import { useQuiz } from "@/types/QuizContext";

import TitleCard from "@/components/TitleCard";
import CheatSheet from "@/components/CheatSheet";
import RadioQuestion from "@/components/questions/RadioQuestion";
import TrueFalseQuestion from "@/components/questions/TrueFalseQuestion";
import ProgressBar from "@/components/questions/ProgressBar";

import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

export default function Index() {
  const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [verify, setVerify] = useState<boolean>(false);
  const [validQuestions, setValidQuestions] = useState<boolean[]>([]);

  const router = useRouter();
  const local = useLocalSearchParams();
  const topicSlug = String(local.topic_slug);
  const quizSlug = String(local.quiz_slug);
  const questionSlug = String(local.question_slug);

  const { quizState, initializeAnswers, setAnswer } = useQuiz();

  // Get question data and remove navigation header
  useEffect(() => {
    var local_quiz = getQuiz(topicSlug, quizSlug);
    var local_questions = local_quiz?.questions ? local_quiz.questions[Number(questionSlug)] : undefined;

    setQuiz(local_quiz);
    setQuestion(local_questions);
    const choiceCount = local_questions?.choices?.length ?? (local_questions?.type === "tf" || local_questions?.type === "truefalse" ? 2 : 0);
    setValidQuestions(new Array(choiceCount).fill(false));
    // initialize answers array for the quiz (one slot per question)
    if ((quizState.answers?.length ?? 0) === 0) {
      initializeAnswers(local_quiz?.questions?.length ?? 0);
    }
  }, []);

  const setValid = (index: number, isValid: boolean) => {
    setValidQuestions((prev) => {
      const newValidArray = [...prev];
      newValidArray[index] = isValid;
      return newValidArray;
    });
  };

  // Compute the next question or end if at the end
  const nextIndex = Number(questionSlug) + 1;
  const next = nextIndex >= (quiz?.questions?.length ?? 0) ? "end" : String(nextIndex);

  return (
    <View style={[gStyles.container, styles.container]}>
      <View style={styles.progressContainer}>
        <ProgressBar count={quiz?.questions?.length ?? 0}/>
      </View>
      <TitleCard title={question?.title ?? ""} content={question?.description ?? ""}/>

      {question?.type === "tf" || question?.type === "truefalse" ? (
        <TrueFalseQuestion question={question} verify={verify} setValid={setValid} />
      ) : (
        <RadioQuestion question={question} verify={verify} setValid={setValid}/>
      )}

      <View style={styles.actionRow}>
        <CheatSheet quiz={quiz} />
        <TouchableOpacity onPress={() => {
          if (!verify)
          {
            setVerify(!verify);
            // set centralized answer for this question index
            setAnswer(Number(questionSlug), validQuestions.every((v) => v === true));
          }
          else
            router.replace(`./${next}`);
        }}>
          <Text style={styles.button}>
            {!verify ? "Vérifier" : "Suivant"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    backgroundColor: colors.background,
    height: "100%",
  },
  button: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    paddingHorizontal: 100,
    textAlign: "center",
    borderRadius: 30,
    backgroundColor: "#0067C6",
    margin: 20
  },
  actionRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginTop: 10,
    marginHorizontal: "20%"
  }
});
