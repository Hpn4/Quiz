import React from "react";
import { View, ScrollView, Text, StyleSheet, Dimensions } from "react-native";

import MdText from '@/components/Markdown';

import type { ThemeColors } from "@/constants/Color";
import { useGlobalStyles } from "@/constants/GlobalStyle";
import { useThemedStyles } from "@/types/ThemeContext";

interface TitleCardProps {
  title?: string;
  content?: string;
  children?: React.ReactNode;
  infoTable?: { key: string; value: string }[];
}

const TitleCard: React.FC<TitleCardProps> = ({ title, content, infoTable, children }) => {
  const windowHeight = Dimensions.get('window').height;
  const maxTableHeight = Math.min(480, windowHeight * 0.45);
  const styles = useThemedStyles(createStyles);
  const gStyles = useGlobalStyles();

  return (
    <View style={[gStyles.card, styles.card]}>
      <View style={styles.titleView}>
        <Text style={styles.title}>{title || ""}</Text>
      </View>
      {children ? <View style={styles.childrenWrap}>{children}</View> : null}
      {infoTable && infoTable.length > 0 ? (
        <ScrollView style={[styles.tableScroll, { maxHeight: maxTableHeight }]}>
          <View style={styles.table}>
            {infoTable.map((row, idx) => (
              <View
                style={[styles.tableRow, idx === infoTable.length - 1 ? styles.tableRowLast : null]}
                key={idx}
              >
                <Text style={styles.tableKey}>{row.key}</Text>
                <Text style={styles.tableValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <MdText content={content ?? ""}/>
      )}
    </View>
  );
};

const GenericCard: React.FC<TitleCardProps> = ({ title, children }) => {
  const styles = useThemedStyles(createStyles);
  const gStyles = useGlobalStyles();

  return (
    <View style={[gStyles.card, styles.genericCard]}>
      <View style={styles.titleView}>
        <Text style={styles.title}>{title || ""}</Text>
      </View>
      {children}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    margin: 15,
    marginBottom: 15,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  genericCard: {
    margin: 15,
    marginBottom: 15,
    paddingBottom: 15,
    alignItems: 'flex-start',
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
    color: colors.text,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  }
  ,
  tableScroll: {
    width: "100%",
  },
  table: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  tableRow: {
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  tableRowLast: {
    marginBottom: 0,
  },
  tableKey: {
    color: colors.accentuation,
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 20,
  },
  tableValue: {
    color: colors.text,
    lineHeight: 22,
    fontSize: 20,
  },
  childrenWrap: {
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 8,
    alignItems: 'flex-end',
  }
});


export default TitleCard;
export {
  GenericCard,
};