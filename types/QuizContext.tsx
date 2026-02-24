import React, { createContext, useContext, useState } from "react";

interface QuizState {
  answers: (boolean | undefined)[];
  score: number;
}

interface QuizContextValue {
  quizState: QuizState;
  initializeAnswers: (length: number) => void;
  setAnswer: (questionIndex: number, isCorrect: boolean) => void;
  clearQuizState: () => void;
}

// Create context with a default any to avoid circular initialization issues
const QuizContext = createContext<QuizContextValue | undefined>(undefined);

// Provider component
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizState, setQuizState] = useState<QuizState>({ answers: [], score: 0 });

  const initializeAnswers = (length: number) => {
    setQuizState({ answers: new Array(length).fill(undefined), score: 0 });
  };

  const setAnswer = (questionIndex: number, isCorrect: boolean) => {
    setQuizState((prev) => {
      const newAnswers = [...(prev.answers || [])];
      newAnswers[questionIndex] = isCorrect;
      const score = newAnswers.filter((v) => v === true).length;
      return { answers: newAnswers, score };
    });
  };

  const clearQuizState = () => {
    setQuizState({ answers: [], score: 0 });
  };

  return (
    <QuizContext.Provider value={{ quizState, initializeAnswers, setAnswer, clearQuizState }}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook for using the context
export const useQuiz = (): QuizContextValue => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within a QuizProvider");
  return ctx;
};
