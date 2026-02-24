import React, { useState } from "react";
import { ScrollView } from "react-native";

import ChoiceEntry from "@/components/questions/ChoiceEntry";
import { Question } from "@/types/Question";

interface RadioQuestionProps {
  question?: Question | undefined;
  verify: boolean;
  setValid: (index: number, isValid: boolean) => void;
}

import { updateMultiSelectionValidity } from "@/components/questions/BaseQuestion";

const RadioQuestion: React.FC<RadioQuestionProps> = ({ question, verify, setValid }) => {
  const choices = question?.choices && question.choices.length ? question.choices : [];
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 15}}>
      {choices.map((title, index) => (
        <ChoiceEntry
          key={index}
          index={index}
          title={title}
          valid={!!question?.answers?.some(a => a == title)}
          checked={selected.includes(index)}
          onToggle={(idx, checked) => {
            const nextSelected = checked ? [...selected, idx] : selected.filter(i => i !== idx);
            setSelected(nextSelected);
            updateMultiSelectionValidity(choices, nextSelected, question, setValid);
          }}
          verify={verify}
        />
      ))}
    </ScrollView>
  );
};

export default RadioQuestion;