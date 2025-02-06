import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";

import { Topic } from "@/types/Topic";
import { getTopics } from "@/types/Data";
import TopicCard from "@/components/TopicCard";

import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

export default function Index() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    setTopics(getTopics());
  }, []);

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
