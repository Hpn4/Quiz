import React from "react";
import { View, ScrollView, Text, Image, StyleSheet, Dimensions } from "react-native";

import MdText from '@/components/Markdown';

import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

interface TitleCardProps {
  title?: string;
  content?: string;
  children?: React.ReactNode;
  infoTable?: { key: string; value: string }[];
}

const TitleCard: React.FC<TitleCardProps> = ({ title, content, infoTable, children }) => {
  const windowHeight = Dimensions.get('window').height;
  const maxTableHeight = Math.min(480, windowHeight * 0.45);

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
  return (
    <View style={[gStyles.card, styles.genericCard]}>
      <View style={styles.titleView}>
        <Text style={styles.title}>{title || ""}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: "white",
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
    color: 'white',
    lineHeight: 22,
    fontSize: 20,
  }
  ,
  childrenWrap: {
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  statsSmall: {
    fontSize: 12,
    color: '#999',
  },
  statsCorrect: {
    fontSize: 12,
    color: colors.green,
    fontWeight: '700',
  }
});


export default TitleCard;
export {
  GenericCard,
};