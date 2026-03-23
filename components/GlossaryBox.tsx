import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import type { ThemeColors } from '@/constants/Color';
import { useGlobalStyles } from '@/constants/GlobalStyle';
import { useThemedStyles } from '@/types/ThemeContext';

interface GlossaryEntry { term: string; definition: string }

interface Props { items?: GlossaryEntry[] }

const GlossaryBox: React.FC<Props> = ({ items }) => {
  const styles = useThemedStyles(createStyles);
  const gStyles = useGlobalStyles();

  if (!items || items.length === 0) return null;
  return (
    <View style={[gStyles.card, styles.card]}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Glossaire</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(it) => it.term}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.term}>{item.term}</Text>
            <Text style={styles.def}>{item.definition}</Text>
          </View>
        )}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    margin: 15,
    marginBottom: 15,
    paddingBottom: 10,
    alignItems: 'flex-start'
  },
  titleView: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingVertical: 8,
    borderColor: colors.stroke,
    width: '100%',
    backgroundColor: colors.title,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: colors.text,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  term: {
    color: colors.text,
    fontWeight: '700',
    marginRight: 8,
    width: 120,
    fontSize: 20,
  },
  def: {
    color: colors.text,
    flex: 1,
    fontSize: 20,
  }
});

export default GlossaryBox;
