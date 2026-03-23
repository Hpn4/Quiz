import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { FlatQuestion } from '@/types/Session';
import type { ThemeColors } from '@/constants/Color';
import { useGlobalStyles } from '@/constants/GlobalStyle';
import { useThemeColors, useThemedStyles } from '@/types/ThemeContext';

type Props = {
  quizQuestions: FlatQuestion[];
  quizStats: any[];
  onStartSingleQuestion: (fq: FlatQuestion) => void;
};

export default function QuizQuestions({ quizQuestions, quizStats, onStartSingleQuestion }: Props) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const gStyles = useGlobalStyles();

  return (
    <View>
      <View style={[gStyles.card, styles.questionListCard]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Questions</Text>
        </View>
        {quizQuestions.map((fq, idx) => {
          const stat = quizStats.find((s) =>
            fq.question?.id ? s.id === fq.question.id : s.questionIndex === fq.questionIndex
          );
          const correct = stat?.correctCount ?? 0;
          const seen = stat?.seenCount ?? 0;
          const last = stat?.lastSeen ?? null;
          const fmtLast = last
            ? new Date(last).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
            : 'Jamais';
          const desc = fq.question?.description ?? '';
          const shortDesc = desc.length > 100 ? desc.slice(0, 100) + '…' : desc;

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => onStartSingleQuestion(fq)}
              style={[styles.questionRow, idx < quizQuestions.length - 1 && styles.questionRowBorder]}
            >
              <View style={styles.questionInfo}>
                <Text style={styles.questionTitle} numberOfLines={2}>
                  {fq.question?.title ?? `Question ${idx + 1}`}
                </Text>
                {shortDesc ? (
                  <Text style={styles.questionDesc} numberOfLines={2}>{shortDesc}</Text>
                ) : null}
              </View>
              <View style={styles.questionStatsCol}>
                <View style={styles.questionStatsRow}>
                  <Text style={{ color: colors.green, fontSize: 13, fontWeight: '700' }}>{correct}</Text>
                  <Text style={{ color: colors.desc, fontSize: 13 }}>/</Text>
                  <Text style={{ color: colors.desc, fontSize: 13 }}>{seen}</Text>
                </View>
                <Text style={styles.questionLast}>{fmtLast}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  questionListCard: {
    margin: 15,
    marginBottom: 15,
    paddingBottom: 0,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  sectionHeader: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingVertical: 8,
    borderColor: colors.stroke,
    width: '100%',
    backgroundColor: colors.title,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    textAlign: 'center',
    color: colors.text,
    fontWeight: '700',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '100%',
    gap: 10,
  },
  questionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  questionInfo: {
    flex: 1,
    gap: 4,
  },
  questionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  questionDesc: {
    color: colors.desc,
    fontSize: 13,
  },
  questionStatsCol: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 50,
  },
  questionStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  questionLast: {
    color: colors.desc_a,
    fontSize: 10,
  },
});
