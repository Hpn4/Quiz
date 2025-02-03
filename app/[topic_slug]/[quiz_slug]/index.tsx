import { useNavigation, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";

import { Quiz } from "@/types/Quiz";
import { getQuiz } from "@/types/Data";

export default function Index() {
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const navigation = useNavigation();
  const local = useLocalSearchParams();

  useEffect(() => {
    setQuiz(getQuiz(local.topic_slug, local.quiz_slug));
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{quiz.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1919",
  },
  text: {
    color: "red"
  }
});
