import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import colors from "@/constants/Color";
import gStyles from "@/constants/GlobalStyle";
import { Question } from "@/types/Question";

interface TextQuestionProps {
  question?: Question | undefined;
  verify: boolean;
  setValid: (index: number, isValid: boolean) => void;
}

function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[-\s\u00A0]+/g, "")
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

const TextQuestion: React.FC<TextQuestionProps> = ({ question, verify, setValid }) => {
  const [value, setValue] = useState("");
  const expected = question?.answers && question.answers.length ? question.answers[0] : "";

  const correct = isAcceptable(value, expected);

  useEffect(() => {
    setValid(0, correct);
  }, [correct, setValid]);

  const state = verify ? (correct ? 2 : 3) : 0;
  const borderColors = [colors.stroke, colors.accentuation, colors.green, colors.red];
  const bgColors = [colors.card, colors.accentuation_a, colors.green_a, colors.red_a];

  return (
    <View style={[gStyles.card, styles.container, { borderColor: borderColors[state], backgroundColor: bgColors[state] }]}> 
      <TextInput
        value={value}
        onChangeText={(t) => setValue(t)}
        placeholder="Tapez votre réponse"
        placeholderTextColor={colors.subtitle}
        style={[styles.input, { borderColor: borderColors[state] }]}
        editable={!verify}
      />

      {verify && !correct ? (
        <View style={{ marginTop: 12 }}>
          <Text style={[styles.wrong, { color: colors.red }]}>{value}</Text>
          <Text style={[styles.correct, { color: colors.green }]}>{expected}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: "white",
    fontSize: 18,
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
