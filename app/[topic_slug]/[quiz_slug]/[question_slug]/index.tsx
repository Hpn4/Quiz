import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Quiz } from "@/types/Quiz";
import { Question } from "@/types/Question";
import { getQuiz } from "@/types/Data";

import TitleCard from "@/components/TitleCard";
import RadioQuestion from "@/components/questions/RadioQuestion";

import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

export default function Index() {
  const [quiz, setQuiz] = useState<Quiz>({});
  const [question, setQuestion] = useState<Question>({});
  const [verify, setVerify] = useState<boolean>(false);

  const router = useRouter();
  const local = useLocalSearchParams();

  // Get question data and remove navigation header
  useEffect(() => {
    var local_quiz = getQuiz(local.topic_slug, local.quiz_slug)
    setQuiz(local_quiz);
    setQuestion(local_quiz.questions[local.question_slug]);
  }, []);

  // Compute the next question or end if at the end
  var next = Number(local.question_slug) + 1;
  next = next >= quiz?.questions?.length ? "end" : next;

  return (
    <View style={[gStyles.container, styles.container]}>
      <TitleCard title={question?.title} content={question?.description}/>

      <RadioQuestion question={question} verify={verify}/>

      <View>
        <TouchableOpacity onPress={() => {
          if (!verify)
            setVerify(!verify);
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
    height: "100%",
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
    margin: 20
  }
});
