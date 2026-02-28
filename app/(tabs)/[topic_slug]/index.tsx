import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";

import { Quiz } from "@/types/Quiz";
import { Topic } from "@/types/Topic";
import { getQuizs, getTopic, getTopicFlatQuestions } from "@/types/Data";
import { useSession } from "@/types/SessionContext";
import gStyles from "@/constants/GlobalStyle"

import QuizCard from "@/components/QuizCard";
import TitleCard from "@/components/TitleCard";
import StartModal from "@/components/StartModal";
import StartButton from "@/components/StartButton";

export default function Index() {
  const [topic, setTopic] = useState<Topic | undefined>(undefined);
  const [quizs, setQuizs] = useState<Quiz[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const local = useLocalSearchParams();
  const topicSlug = String(local.topic_slug);
  const { startSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    setQuizs(getQuizs(topicSlug));
    setTopic(getTopic(topicSlug));
  }, []);

  const topicQuestions = useMemo(
    () => getTopicFlatQuestions(topicSlug),
    [topicSlug]
  );

  const handleStart = (count: number) => {
    setModalVisible(false);
    startSession(topicQuestions, count);
    router.push("/session/0");
  };

  return (
    <View style={gStyles.container}>
      <TitleCard title={topic?.name ?? ""} content={topic?.description ?? ""}/>

      <FlatList
        data={quizs}
        keyExtractor={(item, idx) => item.slug ?? String(idx)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <QuizCard topic_slug={topicSlug} quiz={item}/>}
        contentContainerStyle= {styles.flatList}
      />

      <StartButton onPress={() => setModalVisible(true)} bottomOffset={100} />

      <StartModal
        visible={modalVisible}
        maxQuestions={topicQuestions.length}
        onConfirm={handleStart}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
  },
  flatList: {
    paddingBottom: 90,
    paddingLeft: 10,
    paddingRight: 10
  },
});
