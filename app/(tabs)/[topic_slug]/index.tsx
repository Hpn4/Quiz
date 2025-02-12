import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, StatusBar } from "react-native";

import { Quiz } from "@/types/Quiz";
import { Topic } from "@/types/Topic";
import { getQuizs, getTopic } from "@/types/Data";
import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

import QuizCard from "@/components/QuizCard";
import TitleCard from "@/components/TitleCard";

export default function Index() {
  const [topic, setTopic] = useState<Topic>({});
  const [quizs, setQuizs] = useState<Quiz[]>([]);
  const local = useLocalSearchParams();

  useEffect(() => {
    setQuizs(getQuizs(local.topic_slug));
    setTopic(getTopic(local.topic_slug));
  }, []);

  return (
    <View style={gStyles.container}>
      <TitleCard title={topic.name} content={topic.description}/>

      <FlatList
        data={quizs}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <QuizCard topic_slug={local.topic_slug} quiz={item}/>}
        contentContainerStyle= {styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
  },
  flatList: {
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10
  }
});
