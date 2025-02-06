import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import Markdown from 'react-native-markdown-display';

import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

interface MdTextProps {
  content: string;
}

const MdText: React.FC<MdTextProps> = ({ content }) => {
  return (
    <ScrollView style={styles.content}>
      <Markdown style={markdownStyle}>{content || ""}</Markdown>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  }
});

const markdownStyle = StyleSheet.create({
  body: {
    color: "white",
    fontSize: 20,
    width: "100%",
  },
  heading1: {
    fontSize: 40,
    fontWeight: "bold",
  },
  heading2: {
    fontSize: 37,
    fontWeight: "bold",
  },
  heading3: {
    fontSize: 34,
    fontWeight: "bold",
  },
  heading4: {
    fontSize: 31,
    fontWeight: "bold",
  },
  heading5: {
    fontSize: 28,
    fontWeight: "bold",
  },
  heading6: {
    fontSize: 25,
    fontWeight: "bold",
  },
  table: {
    borderColor: colors.stroke,
  },
  tr: {
    borderColor: colors.stroke,
  },
  td: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.stroke,
  },
  th: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.stroke,
  },
  thead: {
    fontWeight: "bold",
    textAlign: 'center',
  },
  blockquote: {
    backgroundColor: colors.title,
    borderColor: colors.stroke,
    borderLeftWidth: 4,
  },
  code_inline: {
    backgroundColor: colors.background,
  },
  code_block: {
    backgroundColor: colors.background,
    borderColor: colors.stroke,
  },
  fence: {
    backgroundColor: colors.background,
    borderColor: colors.stroke,
  }
});

export default MdText;