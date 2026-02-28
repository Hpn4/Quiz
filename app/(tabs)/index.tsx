import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { Topic } from "@/types/Topic";
import { getTopics, getAllFlatQuestions } from "@/types/Data";
import TopicCard from "@/components/TopicCard";
import StartModal from "@/components/StartModal";
import StartButton from "@/components/StartButton";
import { useSession } from "@/types/SessionContext";

import gStyles from "@/constants/GlobalStyle"

export default function Index() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { startSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    setTopics(getTopics());
  }, []);

  const allQuestions = getAllFlatQuestions();

  const handleStart = (count: number) => {
    setModalVisible(false);
    startSession(allQuestions, count);
    router.push("/session/0");
  };

  return (
    <View style={gStyles.container}>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <TopicCard topic={item}/>}
        contentContainerStyle={styles.flatList}
      />

      <StartButton onPress={() => setModalVisible(true)} bottomOffset={100} />

      <StartModal
        visible={modalVisible}
        maxQuestions={allQuestions.length}
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
