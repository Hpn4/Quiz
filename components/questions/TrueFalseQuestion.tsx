import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import ChoiceEntry from "@/components/questions/ChoiceEntry";
import { Question } from "@/types/Question";
import updateSingleSelectionValidity from "@/components/questions/BaseQuestion";

interface TrueFalseQuestionProps {
  question?: Question | undefined;
  verify: boolean;
  setValid: (index: number, isValid: boolean) => void;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, verify, setValid }) => {
  const choices = question?.choices && question.choices.length ? question.choices : ["Vrai", "Faux"];
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <ScrollView contentContainerStyle={{paddingBottom: 15}}>
      {choices.map((title, index) => (
        <ChoiceEntry
          key={index}
          index={index}
          title={title}
          valid={!!question?.answers?.some(a => a == title)}
          verify={verify}
          checked={selected === index}
          onToggle={(idx, checked) => {
            const nextSelected = checked ? idx : null;
            setSelected(nextSelected);
            updateSingleSelectionValidity(choices, nextSelected, question, setValid);
          }}
        />
      ))}
    </ScrollView>
  );
};

export default TrueFalseQuestion;
