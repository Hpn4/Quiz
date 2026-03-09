import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActiveSession,
  FlatQuestion,
  QuestionStats,
  StatsMap,
} from "@/types/Session";
import {
  defaultStats,
  loadAllStats,
  saveStats,
  statsKey,
  clearAllStats,
} from "@/utils/statsStorage";
import { getAllQuizList } from "@/types/Data";

// == Spaced-repetition priority ==
// Higher value = shown earlier in the pool.
// Unseen questions → Infinity (always first).
// Otherwise: timeSinceLastSeen_hours × (1 - correctRatio × 0.5)
//   - Wrong + old → very high priority
//   - Correct + recent → low priority
function computePriority(stats: QuestionStats | undefined): number {
  if (!stats || stats.seenCount === 0 || stats.lastSeen === null) return Infinity;
  const hoursSince = (Date.now() - stats.lastSeen) / 3_600_000;
  const correctRatio = stats.correctCount / stats.seenCount;
  return hoursSince * (1 - correctRatio * 0.5);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface SessionContextValue {
  stats: StatsMap;
  statsLoaded: boolean;
  session: ActiveSession | null;

  /**
   * Build a pool from `scope`, taking up to `count` questions ordered by
   * spaced-repetition priority, then shuffle, and activate the session.
   * @param returnPath  Route path to navigate back to when the session is dismissed.
   * @param autoClose   Skip the end screen; go straight back to returnPath.
   */
  startSession: (scope: FlatQuestion[], count: number, allowCasClinique?: boolean, returnPath?: string, autoClose?: boolean) => void;

  /** Clear all persisted stats (useful for testing migrations) */
  resetAllStats: () => Promise<void>;

  /** Keep currentIndex in sync with the visible question screen. */
  setCurrentIndex: (index: number) => void;

  /** Record whether the answer at pool position `poolIndex` is correct. */
  recordAnswer: (poolIndex: number, isCorrect: boolean) => void;

  /**
   * Commit the session results to the stats map and persist to disk.
   * Call this when the end screen appears.
   */
  finishSession: () => Promise<void>;

  /** Discard the active session without saving. */
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<StatsMap>({});
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const statsRef = useRef(stats);
  const sessionRef = useRef(session);

  statsRef.current = stats;
  sessionRef.current = session;

  useEffect(() => {
    (async () => {
      try {
        const loaded = await loadAllStats(getAllQuizList());
        setStats(loaded);
      } finally {
        setStatsLoaded(true);
      }
    })();
  }, []);

  const startSession = useCallback(
    (scope: FlatQuestion[], count: number, allowCasClinique: boolean = true, returnPath?: string, autoClose?: boolean) => {
      const currentStats = statsRef.current;
      const filteredScope = allowCasClinique
        ? scope
        : scope.filter((fq) => !(fq.question?.type === "text"));

      // Compute priority for each question, group by priority value,
      // shuffle within each equal-priority group so selection among ties
      // isn't deterministic, then flatten groups ordered by priority.
      const withPriority = filteredScope.map((fq) => {
        const key = statsKey(fq.topicSlug, fq.quizSlug);
        const s = currentStats[key]?.find((x) => x.questionIndex === fq.questionIndex);
        return { fq, p: computePriority(s) };
      });

      const groups = new Map<number, FlatQuestion[]>();
      withPriority.forEach(({ fq, p }) => {
        const g = groups.get(p);
        if (g) g.push(fq);
        else groups.set(p, [fq]);
      });

      const priorities = Array.from(groups.keys()).sort((a, b) => b - a);

      let flattened: FlatQuestion[] = [];
      priorities.forEach((p) => {
        flattened = flattened.concat(shuffle(groups.get(p)!));
      });

      const picked = shuffle(flattened.slice(0, count));

      setSession({
        pool: picked,
        currentIndex: 0,
        answers: new Array(picked.length).fill(undefined),
        returnPath,
        autoClose,
      });
    },
    []
  );

  const recordAnswer = useCallback((poolIndex: number, isCorrect: boolean) => {
    setSession((prev) => {
      if (!prev) return prev;
      const newAnswers = [...prev.answers];
      newAnswers[poolIndex] = isCorrect;
      return { ...prev, answers: newAnswers };
    });
  }, []);

  const setCurrentIndex = useCallback((index: number) => {
    setSession((prev) => {
      if (!prev || prev.currentIndex === index) return prev;
      return { ...prev, currentIndex: index };
    });
  }, []);

  const finishSession = useCallback(async () => {
    const s = sessionRef.current;
    if (!s) return;
    const now = Date.now();

    setStats((prevStats) => {
      const next = { ...prevStats };

      s.pool.forEach((fq, poolIdx) => {
        // Only update stats for questions the user actually answered.
        if (s.answers[poolIdx] === undefined) return;

        const key = statsKey(fq.topicSlug, fq.quizSlug);
        const arr: QuestionStats[] = next[key]
          ? [...next[key]]
          : [];

        const qid = fq.question?.id;
        const existing = qid ? arr.find((x) => x.id === qid) : arr.find((x) => x.questionIndex === fq.questionIndex);
        if (existing) {
          const idx = arr.indexOf(existing);
          arr[idx] = {
            ...existing,
            seenCount: existing.seenCount + 1,
            correctCount:
              existing.correctCount + (s.answers[poolIdx] === true ? 1 : 0),
            lastSeen: now,
          };
        } else {
          arr.push({
            ...defaultStats(fq.questionIndex, fq.question?.id),
            seenCount: 1,
            correctCount: s.answers[poolIdx] === true ? 1 : 0,
            lastSeen: now,
          });
        }
        next[key] = arr;
      });

      // Persist asynchronously (fire and forget inside setState; use ref below)
      return next;
    });
    // Note: we persist after setStats completes via the updated ref on next tick
  }, []);

  // Persist whenever stats change (after finishSession has updated them)
  const pendingSave = useRef(false);
  useEffect(() => {
    if (!statsLoaded || !pendingSave.current) return;

    pendingSave.current = false;
    saveStats(stats).catch(console.error);
  }, [stats, statsLoaded]);

  const finishSessionWrapped = useCallback(async () => {
    pendingSave.current = true;
    await finishSession();
  }, [finishSession]);

  const clearSession = useCallback(() => {
    setSession(null);
  }, []);

  const resetAllStats = useCallback(async () => {
    const quizList = getAllQuizList();
    await clearAllStats(quizList);
    setStats({});
    setStatsLoaded(true);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        stats,
        statsLoaded,
        session,
        startSession,
        setCurrentIndex,
        recordAnswer,
        finishSession: finishSessionWrapped,
        resetAllStats,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
