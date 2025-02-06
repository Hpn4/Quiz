import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, StatusBar, TouchableOpacity } from "react-native";

import { Quiz } from "@/types/Quiz";
import { getQuiz } from "@/types/Data";

import TitleCard from "@/components/TitleCard";

import colors from "@/constants/Color"

export default function Index() {
  const [quiz, setQuiz] = useState<Quiz>({});
  const local = useLocalSearchParams();

  useEffect(() => {
    setQuiz(getQuiz(local.topic_slug, local.quiz_slug));
  }, []);

  return (
    <View style={styles.container}>
      <TitleCard title={quiz.name} content={quiz.description}/>

      <View>
        <Link href={{
          pathname: '/[topic_slug]/[slug]/[question]/',
          params: {
            topic_slug: local.topic_slug,
            slug: quiz.slug,
            question: 0,
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
    justifyContent: "space-between",
    height: "100%",
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
});
