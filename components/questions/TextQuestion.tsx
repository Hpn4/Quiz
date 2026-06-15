import React, { useEffect, useState, useRef, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import type { ThemeColors } from "@/constants/Color";
import { useGlobalStyles } from "@/constants/GlobalStyle";
import { useThemeColors, useThemedStyles } from "@/types/ThemeContext";
import { Question } from "@/types/Question";
import { getAllTextAnswers } from "@/types/Data";

interface TextQuestionProps {
  question?: Question | undefined;
  verify: boolean;
  setValid: (index: number, isValid: boolean) => void;
}

const allTextAnswers = getAllTextAnswers();

function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[-\s ]+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function isAcceptable(userRaw: string, expectedRaw: string) {
  const u = normalizeAnswer(userRaw);
  const e = normalizeAnswer(expectedRaw);
  if (e.length === 0) return false;
  if (u === e) return true;
  const dist = levenshtein(u, e);
  const allowed = e.length <= 6 ? 1 : 2;
  return dist <= allowed;
}

function fuzzyScore(norm: string, query: string): number {
  if (norm === query) return 4;
  if (norm.startsWith(query)) return 3;
  if (norm.includes(query)) return 2;
  const dist = levenshtein(norm.slice(0, query.length + 2), query);
  if (dist <= Math.max(1, Math.floor(query.length / 3))) return 1;
  return 0;
}

function getSuggestions(query: string): string[] {
  if (query.length < 2) return [];
  const norm = normalizeAnswer(query);
  const scored = allTextAnswers
    .map((a) => ({ a, score: fuzzyScore(normalizeAnswer(a), norm) }))
    .filter(({ score }) => score > 0)
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, 6).map(({ a }) => a);
}

const TextQuestion: React.FC<TextQuestionProps> = ({ question, verify, setValid }) => {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const gStyles = useGlobalStyles();
  const answers = question?.answers ?? [];
  const correct = answers.length > 0 && answers.some((a) => isAcceptable(value, a));

  const lastSent = useRef<boolean | null>(null);
  useEffect(() => {
    if (lastSent.current === correct) return;
    setValid(0, correct);
    lastSent.current = correct;
  }, [correct, setValid]);

  const suggestions = useMemo(() => getSuggestions(value), [value]);

  const state = verify ? (correct ? 2 : 3) : 0;
  const borderColors = [colors.stroke, colors.accentuation, colors.green, colors.red];
  const bgColors = [colors.card, colors.accentuation_a, colors.green_a, colors.red_a];

  const handleSelect = (s: string) => {
    setValue(s);
    setShowSuggestions(false);
  };

  return (
    <View style={[gStyles.card, styles.container, { borderColor: borderColors[state], backgroundColor: bgColors[state] }]}>
      <TextInput
        value={value}
        onChangeText={(t) => { setValue(t); setShowSuggestions(true); }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="Tapez votre réponse"
        placeholderTextColor={colors.desc}
        style={[styles.input, { borderColor: borderColors[state] }]}
        editable={!verify}
      />

      {showSuggestions && !verify && suggestions.length > 0 && (
        <ScrollView
          style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.stroke }]}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          {suggestions.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.suggestionItem, { borderBottomColor: colors.stroke }]}
              onPress={() => handleSelect(s)}
            >
              <Text style={[styles.suggestionText, { color: colors.text }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {verify && !correct ? (
        <View style={{ marginTop: 12 }}>
          <Text style={[styles.wrong, { color: colors.red }]}>{value}</Text>
          <Text style={[styles.correct, { color: colors.green }]}>{answers[0]}</Text>
        </View>
      ) : null}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    margin: 13,
    padding: 20,
    borderRadius: 18,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: colors.text,
    fontSize: 18,
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 4,
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  suggestionText: {
    fontSize: 16,
  },
  wrong: {
    textDecorationLine: "line-through",
    marginTop: 6,
    fontSize: 16,
  },
  correct: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TextQuestion;
