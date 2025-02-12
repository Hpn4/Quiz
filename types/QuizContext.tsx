import React, { createContext, useContext, useState } from "react";

// Create context
const QuizContext = createContext();

// Provider component
export const QuizProvider = ({ children }) => {
  const [quizState, setQuizState] = useState({
    answers: [],
    score: 0,
  });

  // Function to update the state
  const updateQuizState = (isCorrect) => {
    setQuizState((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers.push(isCorrect);
      
      return {
        answers: newAnswers,
        score: isCorrect ? prev.score + 1 : prev.score,
      };
    });
  };

  const clearQuizState = () => {
    setQuizState((prev) => {
      return {
        answers: [],
        score: 0,
      }
    });
  }

  return (
    <QuizContext.Provider value={{ quizState, updateQuizState, clearQuizState }}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook for using the context
export const useQuiz = () => useContext(QuizContext);
