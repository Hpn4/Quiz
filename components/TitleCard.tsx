import React from "react";
import { View, ScrollView, Text, Image, StyleSheet } from "react-native";

import MdText from '@/components/Markdown';

import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

interface TitleCardProps {
  title: string;
  content: string;
}

const TitleCard: React.FC<TitleCardProps> = ({ title, content }) => {
  return (
    <View style={[gStyles.card, styles.card]}>
      <View style={styles.titleView}>
        <Text style={styles.title}>{title || ""}</Text>
      </View>
      <MdText content={content}/>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 15,
    maxHeight: "30%",
    marginBottom: 15,
    alignItems: "center",
  },
  titleView: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingVertical: 8,
    borderColor: colors.stroke,
    width: "100%",
    backgroundColor: colors.title,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: "white",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  }
});

export default TitleCard;