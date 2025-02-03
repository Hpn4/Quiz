import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, StatusBar } from "react-native";

import { Topic } from "@/types/Topic";
import { getTopics } from "@/types/Data";
import TopicCard from "@/components/TopicCard";

export default function Index() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    setTopics(getTopics());
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <TopicCard topic={item}/>}
        contentContainerStyle={styles.flatList}
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
