import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";

import { useSession } from "@/types/SessionContext";
import { statsKey } from "@/utils/statsStorage";
import { FlatQuestion } from "@/types/Session";
import { getQuiz } from "@/types/Data";

import TitleCard from "@/components/TitleCard";
import CheatSheet from "@/components/CheatSheet";
import RadioQuestion from "@/components/questions/RadioQuestion";
import TrueFalseQuestion from "@/components/questions/TrueFalseQuestion";
import TextQuestion from "@/components/questions/TextQuestion";
import ProgressBar from "@/components/questions/ProgressBar";

import colors from "@/constants/Color";
import gStyles from "@/constants/GlobalStyle";

export default function SessionQuestion() {
  const { session, recordAnswer, setCurrentIndex, stats } = useSession();
  const router = useRouter();
  const local = useLocalSearchParams();
  const poolIndex = Number(local.index ?? 0);

  const [verify, setVerify] = useState(false);
  const [validQuestions, setValidQuestions] = useState<boolean[]>([]);
  const anim = useRef(new Animated.Value(0)).current;

  const flatQ: FlatQuestion | undefined = session?.pool[poolIndex];
  const question = flatQ?.question;

  const quiz = useMemo(() => {
    if (!flatQ) return undefined;
    return getQuiz(flatQ.topicSlug, flatQ.quizSlug);
  }, [flatQ?.topicSlug, flatQ?.quizSlug]);

  useEffect(() => {
    setVerify(false);
    setCurrentIndex(poolIndex);
    const choiceCount =
      question?.choices?.length ??
      (question?.type === "tf" || question?.type === "truefalse" ? 2 : question?.type === "text" ? 1 : 0);
    setValidQuestions(new Array(choiceCount).fill(false));
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8, tension: 90 }).start();
  }, [poolIndex]);

  if (!session || !flatQ) {
    return (
      <View style={[gStyles.container, styles.container]}>
        <Text style={{ color: "white", margin: 20 }}>
          Aucune session active.
        </Text>
      </View>
    );
  }

  const poolSize = session.pool.length;
  const nextIndex = poolIndex + 1;
  const isLast = nextIndex >= poolSize;

  const setValid = (index: number, isValid: boolean) => {
    setValidQuestions((prev) => {
      const next = [...prev];
      next[index] = isValid;
      return next;
    });
  };

  const handleAction = () => {
    if (!verify) {
      setVerify(true);
      recordAnswer(poolIndex, validQuestions.every((v) => v === true));
    } else {
      if (isLast) {
        router.replace("/session/end");
      } else {
        router.replace(`/session/${nextIndex}`);
      }
    }
  };

  return (
    <View style={[gStyles.container, styles.container]}>
      <View style={styles.progressContainer}>
        <ProgressBar />
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }}
      >
        <TitleCard
          title={question?.title ?? ""}
          content={question?.description ?? ""}
        >
          {(() => {
            const key = statsKey(flatQ?.topicSlug ?? "", flatQ?.quizSlug ?? "");
            const quizStats = stats[key] ?? [];
            const stat = quizStats.find((s) => (question?.id ? s.id === question?.id : s.questionIndex === flatQ?.questionIndex));
            const correct = stat?.correctCount ?? 0;
            const seen = stat?.seenCount ?? 0;
            const last = stat?.lastSeen ?? null;
            const fmtLast = last ? new Date(last).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "Jamais";
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ color: colors.green, fontSize: 12, fontWeight: '700' }}>{correct}</Text>
                  <Text style={{ color: '#999', fontSize: 12 }}>/</Text>
                  <Text style={{ color: '#999', fontSize: 12 }}>{seen}</Text>
                </View>
                <Text style={{ color: '#777', fontSize: 10 }}>{fmtLast}</Text>
              </View>
            );
          })()}
        </TitleCard>

        {question?.type === "tf" || question?.type === "truefalse" ? (
          <TrueFalseQuestion question={question} verify={verify} setValid={setValid} />
        ) : question?.type === "text" ? (
          <TextQuestion question={question} verify={verify} setValid={setValid} />
        ) : (
          <RadioQuestion question={question} verify={verify} setValid={setValid} />
        )}
      </Animated.View>

      <View style={styles.actionRow}>
        <CheatSheet quiz={quiz} />
        <TouchableOpacity onPress={handleAction}>
          <Text style={styles.button}>
            {!verify ? "Vérifier" : isLast ? "Terminer" : "Suivant"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    backgroundColor: colors.background,
    height: "100%",
  },
  progressContainer: {
    marginTop: 10,
    marginHorizontal: "20%",
  },
  button: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    paddingHorizontal: 80,
    textAlign: "center",
    borderRadius: 30,
    backgroundColor: colors.accentuation,
    margin: 20,
  },
  actionRow: {
    flexDirection: "row",
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
