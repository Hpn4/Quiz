import { useNavigation, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, StatusBar } from "react-native";

import { Quiz } from "@/types/Quiz";
import { getQuizs } from "@/types/Data";
import QuizCard from "@/components/QuizCard";

export default function Index() {
  const [quizs, setQuizs] = useState<Quiz[]>([]);
  const navigation = useNavigation();
  const local = useLocalSearchParams();

  useEffect(() => {
    setQuizs(getQuizs(local.topic_slug));
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handlePress = (slug: string) => {
  };

  return (
    <View style={styles.container}>
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
  container: {
    flex: 1,
    backgroundColor: "#1a1919",
  },
  row: {
    justifyContent: "space-between",
  },
  flatList: {
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10
  }
});
