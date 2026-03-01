import { Question } from "@/types/Question";

// A question with its origin (which topic/quiz it belongs to)
export interface FlatQuestion {
  topicSlug: string;
  quizSlug: string;
  questionIndex: number;
  question: Question;
}

// Persisted stats for one question
export interface QuestionStats {
  questionIndex: number;
  id?: string;
  seenCount: number;
  correctCount: number;
  lastSeen: number | null;
}

// Stats for all questions of a quiz – keyed by `topicSlug__quizSlug`
export type StatsMap = Record<string, QuestionStats[]>;

// State of an active quiz session
export interface ActiveSession {
  pool: FlatQuestion[];
  currentIndex: number;
  answers: (boolean | undefined)[];
  returnPath?: string;  // where to navigate when session is dismissed
  autoClose?: boolean;  // if true, skip end screen and go back to returnPath
}
