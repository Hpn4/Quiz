import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuestionStats, StatsMap } from "@/types/Session";

const PREFIX = "quiz_stats__";

export function statsKey(topicSlug: string, quizSlug: string): string {
  return `${PREFIX}${topicSlug}__${quizSlug}`;
}

/** Load all stats entries for the provided quiz list. */
export async function loadAllStats(
  quizList: { topicSlug: string; quizSlug: string }[]
): Promise<StatsMap> {
  const map: StatsMap = {};
  await Promise.all(
    quizList.map(async ({ topicSlug, quizSlug }) => {
      const key = statsKey(topicSlug, quizSlug);
      const value = await AsyncStorage.getItem(key);
      if (value) {
        map[key] = JSON.parse(value) as QuestionStats[];
      }
    })
  );
  return map;
}

/** Persist a stats map to AsyncStorage. */
export async function saveStats(map: StatsMap): Promise<void> {
  await Promise.all(
    Object.entries(map).map(([key, value]) =>
      AsyncStorage.setItem(key, JSON.stringify(value))
    )
  );
}

/** Return default (empty) stats for a question index. */
export function defaultStats(questionIndex: number): QuestionStats {
  return { questionIndex, seenCount: 0, correctCount: 0, lastSeen: null };
}
